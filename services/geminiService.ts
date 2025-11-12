import { GoogleGenAI, Type } from "@google/genai";
import { CATEGORIES, ALL_JAR_NAMES, JARS_CONFIG } from '../constants';
import { Expense, Category, JarName, Jar, SavingsGoal } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY is not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const categorizeAndSuggestJar = async (name: string): Promise<{ category: Category; jar: JarName }> => {
  const jarDescriptions = ALL_JAR_NAMES.map(key => `${key} (${JARS_CONFIG[key].fullName}: ${JARS_CONFIG[key].description})`).join('; ');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Phân tích chi tiêu sau: "${name}".
      1. Chọn một danh mục phù hợp nhất từ: ${CATEGORIES.join(', ')}.
      2. Dựa vào mục đích của các lọ sau, chọn ra 1 lọ phù hợp nhất để chi: ${jarDescriptions}.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: CATEGORIES },
            jar: { type: Type.STRING, enum: ALL_JAR_NAMES },
          },
          required: ['category', 'jar'],
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    return {
        category: CATEGORIES.includes(result.category) ? result.category : 'Khác',
        jar: ALL_JAR_NAMES.includes(result.jar) ? result.jar : 'NEC',
    };
  } catch (error) {
    console.error('Gemini categorization/suggestion failed:', error);
    return { category: 'Khác', jar: 'NEC' };
  }
};

export const suggestGoalIcon = async (name: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Chọn một emoji duy nhất phù hợp nhất cho mục tiêu tiết kiệm sau: "${name}". Chỉ trả về emoji đó, không thêm bất kỳ văn bản nào khác.`,
    });
    return response.text.trim() || '🎯';
  } catch (error) {
    console.error('Gemini icon suggestion failed:', error);
    return '🎯';
  }
};


export const getSpendingAdvice = async (jars: Record<JarName, Jar>, expenses: Expense[], savingsGoals: SavingsGoal[]): Promise<string> => {
  const jarSummary = ALL_JAR_NAMES.map(key => {
    const jar = jars[key];
    return `- Lọ ${jar.fullName} (${key}): ${jar.balance.toLocaleString('vi-VN')}đ còn lại.`;
  }).join('\n');

  const recentExpenses = expenses.slice(0, 10).map(e => `- ${e.name} (${e.jar}): ${e.amount.toLocaleString('vi-VN')}đ`).join('\n');
  
  const savingsSummary = savingsGoals.length > 0
    ? 'Tình hình các mục tiêu tiết kiệm:\n' + savingsGoals.map(g => `- Mục tiêu "${g.name}": Đã đạt ${g.currentAmount.toLocaleString('vi-VN')} / ${g.targetAmount.toLocaleString('vi-VN')}đ (${Math.round((g.currentAmount / g.targetAmount) * 100)}%).`).join('\n')
    : 'Bạn ấy chưa có mục tiêu tiết kiệm nào.';

  const prompt = `Bạn là một chuyên gia tài chính thân thiện và đáng yêu, chuyên đưa ra lời khuyên cho học sinh trung học ở Việt Nam theo phương pháp 6 chiếc lọ.
  
Tình hình tài chính của bạn học sinh hiện tại:
${jarSummary}

10 chi tiêu gần nhất:
${recentExpenses || 'Chưa có chi tiêu nào.'}

${savingsSummary}

Dựa vào tất cả các thông tin trên, hãy đưa ra một vài lời khuyên ngắn gọn, hữu ích và khích lệ. 
- Hãy nhận xét về việc phân bổ chi tiêu vào các lọ. Lọ nào đang làm tốt, lọ nào cần chú ý?
- Nhận xét về tiến độ tiết kiệm cho các mục tiêu. Đưa ra lời động viên để bạn ấy tiếp tục.
- Sử dụng ngôn ngữ gần gũi, dễ thương, tích cực, nói bằng tiếng Việt.
- Bắt đầu bằng một câu chào vui vẻ và trình bày như đang trò chuyện trực tiếp.`;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error('Gemini advice generation failed:', error);
    throw new Error('Could not get advice from AI.');
  }
};