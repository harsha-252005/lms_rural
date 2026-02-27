package com.example.demo.service;

import com.example.demo.model.*;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AssignmentTestService {

    private final AssignmentRepository assignmentRepository;
    private final TestRepository testRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final TestSubmissionRepository testSubmissionRepository;
    private final StudentRepository studentRepository;
    private final GeminiService geminiService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Assignment methods
    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAssignmentsByClass(String classLevel) {
        return assignmentRepository.findByClassLevel(classLevel);
    }

    public List<Assignment> getAssignmentsByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructorId(instructorId);
    }

    // Test methods with auto-generation
    public Test createTest(Test test) {
        if (test.getQuestions() == null || test.getQuestions().isEmpty()) {
            test.setQuestions(generateQuestions(test.getTopic()));
        }
        return testRepository.save(test);
    }

    public List<Test> getTestsByClass(String classLevel) {
        return testRepository.findByClassLevel(classLevel);
    }

    public List<Test> getTestsByInstructor(Long instructorId) {
        return testRepository.findByInstructorId(instructorId);
    }

    // Auto-generate questions based on topic
    private String generateQuestions(String topic) {
        // Try AI Generation first
        String aiQuestions = geminiService.generateQuestions(topic, 10);
        if (aiQuestions != null && !aiQuestions.trim().isEmpty()) {
            return aiQuestions;
        }

        // Fallback to hardcoded bank
        List<Map<String, Object>> questions = new ArrayList<>();

        Map<String, List<Map<String, Object>>> questionBank = getQuestionBank();
        List<Map<String, Object>> topicQuestions = questionBank.getOrDefault(topic.toLowerCase(), new ArrayList<>());

        // If no questions found for topic, use math as default
        if (topicQuestions.isEmpty()) {
            topicQuestions = questionBank.get("math");
        }

        // Generate 10 questions (or all available if less than 10)
        int count = Math.min(10, topicQuestions.size());
        for (int i = 0; i < count; i++) {
            questions.add(topicQuestions.get(i));
        }

        try {
            return objectMapper.writeValueAsString(questions);
        } catch (Exception e) {
            e.printStackTrace();
            return "[]";
        }
    }

    // Question bank for different topics
    private Map<String, List<Map<String, Object>>> getQuestionBank() {
        Map<String, List<Map<String, Object>>> bank = new HashMap<>();

        // Math questions - expanded
        List<Map<String, Object>> mathQuestions = Arrays.asList(
                createQuestion("What is 15 + 27?", Arrays.asList("40", "42", "45", "50"), "42"),
                createQuestion("What is 8 × 7?", Arrays.asList("54", "56", "58", "60"), "56"),
                createQuestion("What is 100 ÷ 4?", Arrays.asList("20", "25", "30", "35"), "25"),
                createQuestion("What is the square root of 64?", Arrays.asList("6", "7", "8", "9"), "8"),
                createQuestion("What is 12²?", Arrays.asList("124", "134", "144", "154"), "144"),
                createQuestion("What is 45 - 18?", Arrays.asList("25", "27", "29", "31"), "27"),
                createQuestion("What is 9 × 9?", Arrays.asList("72", "81", "90", "99"), "81"),
                createQuestion("What is 144 ÷ 12?", Arrays.asList("10", "11", "12", "13"), "12"),
                createQuestion("What is 25% of 200?", Arrays.asList("25", "50", "75", "100"), "50"),
                createQuestion("What is the value of π (pi) approximately?",
                        Arrays.asList("2.14", "3.14", "4.14", "5.14"), "3.14"),
                createQuestion("If x + 5 = 12, what is x?", Arrays.asList("5", "6", "7", "8"), "7"),
                createQuestion("What is 2³ (2 to the power of 3)?", Arrays.asList("6", "8", "9", "12"), "8"),
                createQuestion("What is the perimeter of a square with side 5cm?",
                        Arrays.asList("15cm", "20cm", "25cm", "30cm"), "20cm"),
                createQuestion("What is 0.5 as a fraction?", Arrays.asList("1/2", "1/3", "1/4", "1/5"), "1/2"),
                createQuestion("What is the sum of angles in a triangle?", Arrays.asList("90°", "180°", "270°", "360°"),
                        "180°"));
        bank.put("math", mathQuestions);
        bank.put("mathematics", mathQuestions);

        // Science questions - expanded
        List<Map<String, Object>> scienceQuestions = Arrays.asList(
                createQuestion("What is the chemical symbol for water?", Arrays.asList("H2O", "O2", "CO2", "H2"),
                        "H2O"),
                createQuestion("What planet is closest to the Sun?", Arrays.asList("Venus", "Earth", "Mercury", "Mars"),
                        "Mercury"),
                createQuestion("What is the speed of light?",
                        Arrays.asList("300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"), "300,000 km/s"),
                createQuestion("What gas do plants absorb from the atmosphere?",
                        Arrays.asList("Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"), "Carbon Dioxide"),
                createQuestion("How many bones are in the adult human body?", Arrays.asList("196", "206", "216", "226"),
                        "206"),
                createQuestion("What is the largest planet in our solar system?",
                        Arrays.asList("Saturn", "Jupiter", "Neptune", "Uranus"), "Jupiter"),
                createQuestion("What is the powerhouse of the cell?",
                        Arrays.asList("Nucleus", "Ribosome", "Mitochondria", "Chloroplast"), "Mitochondria"),
                createQuestion("What is the boiling point of water at sea level?",
                        Arrays.asList("90°C", "100°C", "110°C", "120°C"), "100°C"),
                createQuestion("What force keeps us on the ground?",
                        Arrays.asList("Magnetism", "Friction", "Gravity", "Tension"), "Gravity"),
                createQuestion("What is the chemical symbol for Gold?", Arrays.asList("Go", "Gd", "Au", "Ag"), "Au"),
                createQuestion("How many chromosomes do humans have?", Arrays.asList("23", "46", "48", "52"), "46"),
                createQuestion("What is the hardest natural substance?",
                        Arrays.asList("Gold", "Iron", "Diamond", "Platinum"), "Diamond"),
                createQuestion("What type of blood cells fight infection?",
                        Arrays.asList("Red blood cells", "White blood cells", "Platelets", "Plasma"),
                        "White blood cells"),
                createQuestion("What is the center of an atom called?",
                        Arrays.asList("Electron", "Proton", "Neutron", "Nucleus"), "Nucleus"),
                createQuestion("What gas do humans exhale?",
                        Arrays.asList("Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"), "Carbon Dioxide"));
        bank.put("science", scienceQuestions);

        // English questions - expanded
        List<Map<String, Object>> englishQuestions = Arrays.asList(
                createQuestion("What is a noun?",
                        Arrays.asList("Action word", "Describing word", "Person/place/thing", "Connecting word"),
                        "Person/place/thing"),
                createQuestion("What is the past tense of 'run'?", Arrays.asList("Runned", "Ran", "Running", "Runs"),
                        "Ran"),
                createQuestion("What is a synonym for 'happy'?", Arrays.asList("Sad", "Joyful", "Angry", "Tired"),
                        "Joyful"),
                createQuestion("What is an adjective?",
                        Arrays.asList("Action word", "Describing word", "Person/place/thing", "Connecting word"),
                        "Describing word"),
                createQuestion("What is the plural of 'child'?",
                        Arrays.asList("Childs", "Children", "Childes", "Childrens"), "Children"),
                createQuestion("What is an antonym of 'hot'?", Arrays.asList("Warm", "Cold", "Cool", "Freezing"),
                        "Cold"),
                createQuestion("What is a verb?",
                        Arrays.asList("Action word", "Describing word", "Person/place/thing", "Connecting word"),
                        "Action word"),
                createQuestion("Which is correct?",
                        Arrays.asList("He don't like it", "He doesn't like it", "He not like it", "He no like it"),
                        "He doesn't like it"),
                createQuestion("What is the past tense of 'go'?", Arrays.asList("Goed", "Gone", "Went", "Going"),
                        "Went"),
                createQuestion("What is a pronoun?",
                        Arrays.asList("I, you, he, she", "Run, jump, play", "Big, small, red", "And, but, or"),
                        "I, you, he, she"),
                createQuestion("What is the plural of 'mouse'?", Arrays.asList("Mouses", "Mice", "Meese", "Mices"),
                        "Mice"),
                createQuestion("Which word is a preposition?", Arrays.asList("Run", "Happy", "Under", "Quickly"),
                        "Under"),
                createQuestion("What is the superlative form of 'good'?",
                        Arrays.asList("Gooder", "Goodest", "Better", "Best"), "Best"),
                createQuestion("What punctuation ends a question?",
                        Arrays.asList("Period (.)", "Comma (,)", "Question mark (?)", "Exclamation (!)"),
                        "Question mark (?)"),
                createQuestion("What is a compound word?", Arrays.asList("Sunshine", "Beautiful", "Running", "Quickly"),
                        "Sunshine"));
        bank.put("english", englishQuestions);

        // History questions
        List<Map<String, Object>> historyQuestions = Arrays.asList(
                createQuestion("Who was the first President of India?",
                        Arrays.asList("Jawaharlal Nehru", "Dr. Rajendra Prasad", "Mahatma Gandhi", "Sardar Patel"),
                        "Dr. Rajendra Prasad"),
                createQuestion("In which year did India gain independence?",
                        Arrays.asList("1945", "1947", "1950", "1952"), "1947"),
                createQuestion("Who is known as the Father of the Nation in India?",
                        Arrays.asList("Nehru", "Gandhi", "Ambedkar", "Patel"), "Gandhi"),
                createQuestion("What was the ancient name of India?",
                        Arrays.asList("Hindustan", "Bharat", "Aryavarta", "All of these"), "All of these"),
                createQuestion("Who built the Taj Mahal?", Arrays.asList("Akbar", "Shah Jahan", "Aurangzeb", "Humayun"),
                        "Shah Jahan"),
                createQuestion("When was the Indian Constitution adopted?",
                        Arrays.asList("1947", "1948", "1949", "1950"), "1949"),
                createQuestion("Who wrote the Indian National Anthem?",
                        Arrays.asList("Tagore", "Bankim Chandra", "Iqbal", "Nehru"), "Tagore"),
                createQuestion("What is the national animal of India?",
                        Arrays.asList("Lion", "Tiger", "Elephant", "Peacock"), "Tiger"),
                createQuestion("Who was the first woman Prime Minister of India?",
                        Arrays.asList("Indira Gandhi", "Pratibha Patil", "Sonia Gandhi", "Sarojini Naidu"),
                        "Indira Gandhi"),
                createQuestion("In which city is India Gate located?",
                        Arrays.asList("Mumbai", "Kolkata", "New Delhi", "Chennai"), "New Delhi"));
        bank.put("history", historyQuestions);

        return bank;
    }

    private Map<String, Object> createQuestion(String question, List<String> options, String correctAnswer) {
        Map<String, Object> q = new HashMap<>();
        q.put("question", question);
        q.put("options", options);
        q.put("correctAnswer", correctAnswer);
        return q;
    }

    // Assignment submission
    public AssignmentSubmission submitAssignment(AssignmentSubmission submission) {
        return assignmentSubmissionRepository.save(submission);
    }

    public List<AssignmentSubmission> getStudentAssignmentSubmissions(Long studentId) {
        return assignmentSubmissionRepository.findByStudentId(studentId);
    }

    public List<AssignmentSubmission> getAssignmentSubmissions(Long assignmentId) {
        return assignmentSubmissionRepository.findByAssignmentId(assignmentId);
    }

    // Test submission with auto-evaluation
    public TestSubmission submitTest(TestSubmission submission) {
        try {
            Test test = testRepository.findById(submission.getTestId()).orElseThrow();

            List<Map<String, Object>> questions = objectMapper.readValue(test.getQuestions(), new TypeReference<>() {
            });
            List<Map<String, Object>> studentAnswers = objectMapper.readValue(submission.getAnswers(),
                    new TypeReference<>() {
                    });

            int score = 0;
            List<Map<String, Object>> evaluation = new ArrayList<>();

            for (int i = 0; i < questions.size(); i++) {
                Map<String, Object> question = questions.get(i);
                String correctAnswer = (String) question.get("correctAnswer");
                String studentAnswer = i < studentAnswers.size() ? (String) studentAnswers.get(i).get("answer") : "";

                boolean isCorrect = correctAnswer.equalsIgnoreCase(studentAnswer);
                if (isCorrect)
                    score++;

                Map<String, Object> eval = new HashMap<>();
                eval.put("questionId", i);
                eval.put("correct", isCorrect);
                eval.put("correctAnswer", correctAnswer);
                eval.put("studentAnswer", studentAnswer);
                evaluation.add(eval);
            }

            submission.setScore(score);
            submission.setTotalMarks(questions.size());
            submission.setEvaluation(objectMapper.writeValueAsString(evaluation));

        } catch (Exception e) {
            submission.setScore(0);
            submission.setTotalMarks(0);
        }

        return testSubmissionRepository.save(submission);
    }

    public List<TestSubmission> getStudentTestSubmissions(Long studentId) {
        return testSubmissionRepository.findByStudentId(studentId);
    }

    public List<TestSubmission> getTestSubmissions(Long testId) {
        return testSubmissionRepository.findByTestId(testId);
    }
}
