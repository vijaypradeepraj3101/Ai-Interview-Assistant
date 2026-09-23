import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";

const QUESTION_COUNT = 12;

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const objectMatch = text.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      return JSON.parse(objectMatch[0]);
    }
    throw new Error("Invalid JSON returned by AI");
  }
}

function detectExperienceLevel(experience = "", resumeText = "") {
  const exp = `${experience} ${resumeText}`.toLowerCase();

  if (
    exp.includes("fresher") ||
    exp.includes("graduate") ||
    exp.includes("entry level") ||
    exp.includes("0 year") ||
    exp.includes("0 years") ||
    exp.includes("intern")
  ) {
    return "fresher";
  }

  if (
    exp.includes("1 year") ||
    exp.includes("2 year") ||
    exp.includes("1 years") ||
    exp.includes("2 years")
  ) {
    return "junior";
  }

  if (
    exp.includes("3 year") ||
    exp.includes("4 year") ||
    exp.includes("5 year") ||
    exp.includes("3 years") ||
    exp.includes("4 years") ||
    exp.includes("5 years")
  ) {
    return "mid";
  }

  return "senior";
}

function getDifficultyByIndex(index) {
  if (index < 4) return "easy";
  if (index < 8) return "medium";
  return "hard";
}

function getTimeLimitByDifficulty(difficulty) {
  if (difficulty === "easy") return 60;
  if (difficulty === "medium") return 90;
  return 120;
}

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }

    const filepath = req.file.path;
    const fileBuffer = await fs.promises.readFile(filepath);
    const uint8Array = new Uint8Array(fileBuffer);

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str || "").join(" ");
      resumeText += pageText + "\n";
    }

    resumeText = resumeText
      .replace(/\s+/g, " ")
      .replace(/\s([,.])/g, "$1")
      .trim();

    if (!resumeText || resumeText.length < 80) {
      fs.unlinkSync(filepath);
      return res.status(400).json({
        message:
          "Resume text could not be extracted properly. Please upload a clean text-based PDF.",
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are an expert resume analyzer.

Extract structured information from the resume.

Return ONLY valid JSON in this exact format:
{
  "role": "string",
  "experience": "string",
  "experienceLevel": "fresher | junior | mid | senior",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"],
  "education": ["education1"],
  "summary": "short summary"
}

Rules:
- Keep role short and realistic.
- Infer experience carefully from internships, projects, graduation year, or work history if exact years are not clearly written.
- Keep projects specific and useful.
- Keep skills specific technical or professional skills only.
- Return arrays only for projects, skills, and education.
- Return only JSON.
        `,
      },
      {
        role: "user",
        content: resumeText,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    fs.unlinkSync(filepath);

    return res.status(200).json({
      role: parsed.role || "",
      experience: parsed.experience || "",
      experienceLevel:
        parsed.experienceLevel ||
        detectExperienceLevel(parsed.experience || "", resumeText),
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
      summary: parsed.summary || "",
      resumeText,
    });
  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: `Failed to analyze resume: ${error.message}`,
    });
  }
};

export const generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({
        message: "Role, Experience and Mode are required.",
      });
    }

    if (!["HR", "Technical", "Mixed"].includes(mode)) {
      return res.status(400).json({
        message: "Invalid interview mode.",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (!user.name || !user.name.trim()) {
      return res.status(400).json({
        message: "User name missing. Please login again.",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits. Minimum 50 required.",
      });
    }

    const projectText =
      Array.isArray(projects) && projects.length ? projects.join(", ") : "None";

    const skillsText =
      Array.isArray(skills) && skills.length ? skills.join(", ") : "None";

    const safeResume = resumeText?.trim() || "None";
    const experienceLevel = detectExperienceLevel(experience, safeResume);

    const userPrompt = `
Candidate Name: ${user.name}
Role: ${role}
Experience: ${experience}
Experience Level: ${experienceLevel}
Interview Mode: ${mode}
Projects: ${projectText}
Skills: ${skillsText}
Resume: ${safeResume}
    `;

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer conducting a real interview.

You must ask exactly ${QUESTION_COUNT} interview questions in a proper interview flow.

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "question": "string",
      "difficulty": "easy | medium | hard",
      "timeLimit": 60
    }
  ]
}

Global rules:
- Ask exactly ${QUESTION_COUNT} questions.
- Each question must be a single sentence.
- Each question must sound natural, realistic, and professional.
- Do not sound robotic, textbook-like, or repetitive.
- Do not number the questions inside the question text.
- Do not add explanations before or after the JSON.
- Use simple and conversational interview language.
- Questions must follow a natural interview progression from introduction to deeper discussion.
- Use the candidate role, experience, projects, skills, and resume details wherever relevant.

Difficulty distribution:
- Questions 1 to 4 = easy
- Questions 5 to 8 = medium
- Questions 9 to 12 = hard

Time limits:
- easy = 60
- medium = 90
- hard = 120

TECHNICAL MODE FLOW:
If candidate is fresher:
1. Start with self-introduction and background.
2. Then ask about one or two important projects from the resume.
3. Then ask about skills and tools used in those projects.
4. Then ask practical technical questions related to those skills.
5. Then ask debugging, improvement, optimization, and scenario-based questions.
6. End with harder but fresher-appropriate technical reasoning questions.

If candidate is experienced:
1. Start with current role and recent responsibilities.
2. Then ask about key projects, impact, ownership, and decisions.
3. Then ask about technical stack, architecture choices, trade-offs, and debugging.
4. Then ask practical scenario-based questions from real work situations.
5. End with harder experience-level questions on scaling, optimization, leadership, architecture, reliability, or decision-making.

HR MODE FLOW:
If candidate is fresher:
1. Start with tell me about yourself.
2. Then ask about education and transition into the role.
3. Then ask about projects, strengths, and learning approach.
4. Then ask about teamwork, challenges, and communication.
5. Then ask why this role and why this company type.
6. End with future goals, pressure handling, and situational HR questions.

If candidate is experienced:
1. Start with profile summary and current role.
2. Then ask about career journey and achievements.
3. Then ask about strengths, weaknesses, teamwork, and conflict handling.
4. Then ask about ownership, leadership, deadlines, pressure, and decision-making.
5. End with job switch reasons, motivation, future plans, and difficult HR scenarios.

MIXED MODE FLOW:
1. Start with intro and background.
2. Then ask HR-style profile and motivation questions.
3. Then move to projects and skills.
4. Then ask practical technical questions.
5. Then ask scenario-based communication or teamwork questions.
6. End with harder technical or decision-making questions based on experience level.

Important rules:
- For fresher candidates, hard questions must still be suitable for a fresher.
- For experienced candidates, hard questions must feel deeper and more practical.
- Questions should feel like a real interviewer is gradually moving forward in the discussion.
- Avoid generic repeated questions.
        `,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    const aiQuestions = Array.isArray(parsed.questions) ? parsed.questions : [];

    if (aiQuestions.length === 0) {
      return res.status(500).json({
        message: "AI failed to generate questions.",
      });
    }

    const normalizedQuestions = aiQuestions.slice(0, QUESTION_COUNT).map((item, index) => {
      const difficulty = getDifficultyByIndex(index);
      const timeLimit = getTimeLimitByDifficulty(difficulty);

      return {
        question: item?.question?.trim() || "Question not generated properly.",
        difficulty,
        timeLimit,
      };
    });

    if (normalizedQuestions.length < QUESTION_COUNT) {
      return res.status(500).json({
        message: "AI returned fewer questions than expected.",
      });
    }

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: normalizedQuestions,
    });

    await User.updateOne({ _id: user._id }, { $inc: { credits: -50 } });

    const updatedUser = await User.findById(user._id);

    return res.status(200).json({
      interviewId: interview._id,
      creditsLeft: updatedUser?.credits ?? user.credits - 50,
      userName: updatedUser?.name || user.name,
      questions: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to create interview: ${error.message}`,
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(400).json({ message: "Invalid question index." });
    }

    if (!answer || !answer.trim()) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";
      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
      });
    }

    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;
      await interview.save();

      return res.status(200).json({
        feedback: question.feedback,
      });
    }

    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer.

Evaluate naturally, fairly, and realistically.

Score the answer in these areas from 0 to 10:
1. Confidence
2. Communication
3. Correctness

Rules:
- Be unbiased.
- Do not give random high scores.
- Strong answers should score high.
- Weak, unclear, or incomplete answers should score low.
- Consider clarity, relevance, structure, and technical correctness if applicable.

Calculate:
finalScore = average of confidence, communication, and correctness rounded to nearest whole number.

Feedback rules:
- Write natural human feedback.
- Use 10 to 15 words only.
- Sound professional and realistic.
- Keep it short and direct.
- Do not explain the scoring.
- Return ONLY valid JSON.

Return JSON in this format:
{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
        `,
      },
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
        `,
      },
    ];

    const aiResponse = await askAi(messages);
    const parsed = safeJsonParse(aiResponse);

    question.answer = answer;
    question.confidence = parsed.confidence || 0;
    question.communication = parsed.communication || 0;
    question.correctness = parsed.correctness || 0;
    question.score = parsed.finalScore || 0;
    question.feedback = parsed.feedback || "Feedback not available.";

    await interview.save();

    return res.status(200).json({
      feedback: parsed.feedback || "Feedback not available.",
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to submit answer: ${error.message}`,
    });
  }
};

export const finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions ? totalScore / totalQuestions : 0;
    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to finish interview: ${error.message}`,
    });
  }
};

export const getMyInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    return res.status(200).json(interviews);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to get interviews: ${error.message}`,
    });
  }
};

export const getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    return res.status(200).json({
      finalScore: Number((interview.finalScore || 0).toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to get interview report: ${error.message}`,
    });
  }
};
