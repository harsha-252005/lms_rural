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
                System.out.println("DEBUG_SERVICE: Creating assignment: " + assignment.getTitle() + " for instructor: "
                                + assignment.getInstructorId());
                Assignment saved = assignmentRepository.save(assignment);
                System.out.println("DEBUG_SERVICE: Assignment saved with ID: " + saved.getId()
                                + ". Total assignments in repo: " + assignmentRepository.count());
                return saved;
        }

        public List<Assignment> getAssignmentsByClass(String classLevel) {
                return assignmentRepository.findByClassLevel(classLevel);
        }

        public List<Assignment> getAssignmentsByInstructor(Long instructorId) {
                System.out.println("DEBUG_SERVICE: Fetching assignments for instructor: " + instructorId);
                List<Assignment> assignments = assignmentRepository.findByInstructorId(instructorId);
                System.out.println("DEBUG_SERVICE: Found " + assignments.size() + " assignments. Total in repo: "
                                + assignmentRepository.count());
                return assignments;
        }

        // Test methods with auto-generation
        public Test createTest(Test test) {
                System.out.println("DEBUG_TEST: Creating test: " + test.getTitle() + " for instructor: "
                                + test.getInstructorId());
                if (test.getQuestions() == null || test.getQuestions().isEmpty()) {
                        String generationTopic = test.getTopic();
                        if (test.getTitle() != null && !test.getTitle().isEmpty()) {
                                generationTopic = test.getTitle() + " (" + test.getTopic() + ")";
                        }
                        System.out.println("DEBUG_TEST: Questions empty, generating for: " + generationTopic);
                        test.setQuestions(generateQuestions(generationTopic));
                }
                Test savedTest = testRepository.save(test);
                System.out.println("DEBUG_TEST: Test saved with ID: " + savedTest.getId());
                return savedTest;
        }

        public List<Test> getTestsByClass(String classLevel) {
                System.out.println("DEBUG_TEST: Fetching tests for class: " + classLevel);
                List<Test> tests = testRepository.findByClassLevel(classLevel);
                System.out.println("DEBUG_TEST: Found " + tests.size() + " tests");
                return tests;
        }

        public List<Test> getTestsByInstructor(Long instructorId) {
                System.out.println("DEBUG_TEST: Fetching tests for instructor: " + instructorId);
                List<Test> tests = testRepository.findByInstructorId(instructorId);
                System.out.println("DEBUG_TEST: Found " + tests.size() + " tests");
                return tests;
        }

        public String generateQuestions(String topic) {
                // Try AI Generation first
                String cleanTopic = (topic != null) ? topic.toLowerCase().trim() : "math";
                System.out.println("DEBUG_TEST: Attempting AI generation for topic: " + cleanTopic);

                String aiQuestions = geminiService.generateQuestions(cleanTopic, 10);
                if (aiQuestions != null && aiQuestions.contains("\"question\"") && aiQuestions.contains("[")
                                && aiQuestions.length() > 50) {
                        System.out.println("DEBUG_TEST: AI successfully generated questions.");
                        return aiQuestions;
                }

                System.out.println("DEBUG_TEST: AI failed or returned empty. Falling back to hardcoded bank.");

                // Smart fallback: extract base category and match sub-topics by keywords
                String baseCategory = cleanTopic;
                String titlePart = "";

                // Extract category from parentheses: "introduction to plants (science)" ->
                // base="science", title="introduction to plants"
                if (cleanTopic.contains("(") && cleanTopic.contains(")")) {
                        int start = cleanTopic.lastIndexOf("(");
                        int end = cleanTopic.lastIndexOf(")");
                        baseCategory = cleanTopic.substring(start + 1, end).trim();
                        titlePart = cleanTopic.substring(0, start).trim();
                } else {
                        titlePart = cleanTopic;
                }

                System.out.println("DEBUG_TEST: Base category: " + baseCategory + ", Title: " + titlePart);

                Map<String, List<Map<String, Object>>> questionBank = getQuestionBank();

                // 1. Try to match sub-topics by scanning keywords in the title
                List<Map<String, Object>> topicQuestions = findBestMatch(titlePart, questionBank);

                // 2. If no sub-topic matched, try the base category
                if (topicQuestions.isEmpty()) {
                        topicQuestions = questionBank.getOrDefault(baseCategory, new ArrayList<>());
                }

                // 3. If still empty, try the full cleanTopic as-is
                if (topicQuestions.isEmpty()) {
                        topicQuestions = questionBank.getOrDefault(cleanTopic, new ArrayList<>());
                }

                // 4. DYNAMIC FALLBACK: Generate template-based questions for ANY topic
                if (topicQuestions.isEmpty()) {
                        System.out.println("DEBUG_TEST: No hardcoded match. Using dynamic template generation for: "
                                        + titlePart);
                        topicQuestions = generateDynamicQuestions(titlePart, baseCategory);
                }

                List<Map<String, Object>> questions = new ArrayList<>();
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

        // Keyword-based sub-topic matching
        private List<Map<String, Object>> findBestMatch(String title, Map<String, List<Map<String, Object>>> bank) {
                String[][] keywordMap = {
                                { "plant", "botany", "flower", "leaf", "root", "seed", "photosynthesis",
                                                "chlorophyll" },
                                { "animal", "zoology", "mammal", "reptile", "bird", "insect", "fish", "amphibian" },
                                { "physics", "force", "motion", "energy", "gravity", "newton", "velocity",
                                                "acceleration" },
                                { "chemistry", "chemical", "element", "compound", "reaction", "acid", "base",
                                                "molecule" },
                                { "biology", "cell", "dna", "gene", "organ", "tissue", "evolution", "ecosystem" },
                                { "geometry", "triangle", "circle", "square", "angle", "polygon", "area", "perimeter" },
                                { "algebra", "equation", "variable", "polynomial", "linear", "quadratic",
                                                "expression" },
                                { "grammar", "tense", "noun", "verb", "adjective", "adverb", "sentence",
                                                "punctuation" },
                };
                String[] bankKeys = { "plants", "animals", "physics", "chemistry", "biology", "geometry", "algebra",
                                "grammar" };

                for (int i = 0; i < keywordMap.length; i++) {
                        for (String keyword : keywordMap[i]) {
                                if (title.contains(keyword)) {
                                        List<Map<String, Object>> matched = bank.get(bankKeys[i]);
                                        if (matched != null && !matched.isEmpty()) {
                                                System.out.println("DEBUG_TEST: Matched sub-topic '" + bankKeys[i]
                                                                + "' via keyword '" + keyword + "'");
                                                return matched;
                                        }
                                }
                        }
                }
                return new ArrayList<>();
        }

        // ==================== QUESTION BANKS ====================
        private Map<String, List<Map<String, Object>>> getQuestionBank() {
                Map<String, List<Map<String, Object>>> bank = new HashMap<>();

                // ===== MATH =====
                List<Map<String, Object>> mathQuestions = Arrays.asList(
                                createQuestion("What is 15 + 27?", Arrays.asList("40", "42", "45", "50"), "42"),
                                createQuestion("What is 8 x 7?", Arrays.asList("54", "56", "58", "60"), "56"),
                                createQuestion("What is 100 / 4?", Arrays.asList("20", "25", "30", "35"), "25"),
                                createQuestion("What is the square root of 64?", Arrays.asList("6", "7", "8", "9"),
                                                "8"),
                                createQuestion("What is 12 squared?", Arrays.asList("124", "134", "144", "154"), "144"),
                                createQuestion("What is 45 - 18?", Arrays.asList("25", "27", "29", "31"), "27"),
                                createQuestion("What is 9 x 9?", Arrays.asList("72", "81", "90", "99"), "81"),
                                createQuestion("What is 144 / 12?", Arrays.asList("10", "11", "12", "13"), "12"),
                                createQuestion("What is 25% of 200?", Arrays.asList("25", "50", "75", "100"), "50"),
                                createQuestion("What is the value of pi approximately?",
                                                Arrays.asList("2.14", "3.14", "4.14", "5.14"), "3.14"));
                bank.put("math", mathQuestions);
                bank.put("mathematics", mathQuestions);

                // ===== GEOMETRY =====
                List<Map<String, Object>> geometryQuestions = Arrays.asList(
                                createQuestion("How many sides does a hexagon have?", Arrays.asList("5", "6", "7", "8"),
                                                "6"),
                                createQuestion("What is the sum of angles in a triangle?",
                                                Arrays.asList("90 degrees", "180 degrees", "270 degrees",
                                                                "360 degrees"),
                                                "180 degrees"),
                                createQuestion("What is the area of a rectangle with length 5 and width 3?",
                                                Arrays.asList("8", "15", "16", "20"), "15"),
                                createQuestion("What is the circumference formula of a circle?",
                                                Arrays.asList("pi r squared", "2 pi r", "pi d squared", "2 pi d"),
                                                "2 pi r"),
                                createQuestion("What is the perimeter of a square with side 7cm?",
                                                Arrays.asList("14cm", "21cm", "28cm", "49cm"), "28cm"),
                                createQuestion("A right angle measures how many degrees?",
                                                Arrays.asList("45", "90", "180", "360"), "90"),
                                createQuestion("How many vertices does a cube have?",
                                                Arrays.asList("4", "6", "8", "12"), "8"),
                                createQuestion("What shape has 4 equal sides and 4 right angles?",
                                                Arrays.asList("Rectangle", "Rhombus", "Square", "Parallelogram"),
                                                "Square"),
                                createQuestion("What is the area of a triangle with base 10 and height 6?",
                                                Arrays.asList("16", "30", "60", "36"), "30"),
                                createQuestion("What type of angle is greater than 90 but less than 180 degrees?",
                                                Arrays.asList("Acute", "Right", "Obtuse", "Reflex"), "Obtuse"));
                bank.put("geometry", geometryQuestions);

                // ===== ALGEBRA =====
                List<Map<String, Object>> algebraQuestions = Arrays.asList(
                                createQuestion("If x + 5 = 12, what is x?", Arrays.asList("5", "6", "7", "8"), "7"),
                                createQuestion("What is 2x when x = 4?", Arrays.asList("2", "6", "8", "10"), "8"),
                                createQuestion("Solve: 3x = 15", Arrays.asList("3", "5", "12", "45"), "5"),
                                createQuestion("What is the value of x in x - 3 = 7?",
                                                Arrays.asList("4", "7", "10", "21"), "10"),
                                createQuestion("Simplify: 2(x + 3) when x = 2", Arrays.asList("7", "8", "10", "12"),
                                                "10"),
                                createQuestion("What is x squared when x = 5?", Arrays.asList("10", "15", "20", "25"),
                                                "25"),
                                createQuestion("If 2x + 4 = 10, what is x?", Arrays.asList("2", "3", "4", "5"), "3"),
                                createQuestion("What is the coefficient of x in 5x + 3?",
                                                Arrays.asList("3", "5", "8", "x"), "5"),
                                createQuestion("Solve: x/2 = 6", Arrays.asList("3", "6", "8", "12"), "12"),
                                createQuestion("What is a variable in algebra?",
                                                Arrays.asList("A fixed number", "A letter representing unknown value",
                                                                "An operation", "A constant"),
                                                "A letter representing unknown value"));
                bank.put("algebra", algebraQuestions);

                // ===== GENERAL SCIENCE =====
                List<Map<String, Object>> scienceQuestions = Arrays.asList(
                                createQuestion("What is the chemical symbol for water?",
                                                Arrays.asList("H2O", "O2", "CO2", "H2"), "H2O"),
                                createQuestion("What planet is closest to the Sun?",
                                                Arrays.asList("Venus", "Earth", "Mercury", "Mars"), "Mercury"),
                                createQuestion("What gas do plants absorb from the atmosphere?",
                                                Arrays.asList("Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"),
                                                "Carbon Dioxide"),
                                createQuestion("What is the largest planet in our solar system?",
                                                Arrays.asList("Saturn", "Jupiter", "Neptune", "Uranus"), "Jupiter"),
                                createQuestion("What is the powerhouse of the cell?",
                                                Arrays.asList("Nucleus", "Ribosome", "Mitochondria", "Chloroplast"),
                                                "Mitochondria"),
                                createQuestion("What is the boiling point of water at sea level?",
                                                Arrays.asList("90 C", "100 C", "110 C", "120 C"), "100 C"),
                                createQuestion("What force keeps us on the ground?",
                                                Arrays.asList("Magnetism", "Friction", "Gravity", "Tension"),
                                                "Gravity"),
                                createQuestion("What is the chemical symbol for Gold?",
                                                Arrays.asList("Go", "Gd", "Au", "Ag"), "Au"),
                                createQuestion("What is the hardest natural substance?",
                                                Arrays.asList("Gold", "Iron", "Diamond", "Platinum"), "Diamond"),
                                createQuestion("What gas do humans exhale?",
                                                Arrays.asList("Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"),
                                                "Carbon Dioxide"));
                bank.put("science", scienceQuestions);

                // ===== PLANTS / BOTANY =====
                List<Map<String, Object>> plantQuestions = Arrays.asList(
                                createQuestion("What process do plants use to make food?",
                                                Arrays.asList("Respiration", "Photosynthesis", "Fermentation",
                                                                "Digestion"),
                                                "Photosynthesis"),
                                createQuestion("What pigment gives leaves their green color?",
                                                Arrays.asList("Melanin", "Carotene", "Chlorophyll", "Xanthophyll"),
                                                "Chlorophyll"),
                                createQuestion("What part of the plant absorbs water from the soil?",
                                                Arrays.asList("Stem", "Leaves", "Roots", "Flowers"), "Roots"),
                                createQuestion("What gas do plants release during photosynthesis?",
                                                Arrays.asList("Carbon Dioxide", "Nitrogen", "Oxygen", "Hydrogen"),
                                                "Oxygen"),
                                createQuestion("What is the male reproductive part of a flower called?",
                                                Arrays.asList("Pistil", "Stamen", "Petal", "Sepal"), "Stamen"),
                                createQuestion("What is the female reproductive part of a flower called?",
                                                Arrays.asList("Stamen", "Pistil", "Petal", "Sepal"), "Pistil"),
                                createQuestion("Which part of the plant conducts water upwards?",
                                                Arrays.asList("Phloem", "Xylem", "Cortex", "Epidermis"), "Xylem"),
                                createQuestion("What do seeds need to germinate?",
                                                Arrays.asList("Only sunlight", "Water, warmth, and air", "Only soil",
                                                                "Only water"),
                                                "Water, warmth, and air"),
                                createQuestion("What type of plant completes its life cycle in one year?",
                                                Arrays.asList("Perennial", "Annual", "Biennial", "Deciduous"),
                                                "Annual"),
                                createQuestion("What is pollination?",
                                                Arrays.asList("Seed dispersal",
                                                                "Transfer of pollen from anther to stigma",
                                                                "Absorption of nutrients", "Release of oxygen"),
                                                "Transfer of pollen from anther to stigma"));
                bank.put("plants", plantQuestions);
                bank.put("botany", plantQuestions);

                // ===== ANIMALS / ZOOLOGY =====
                List<Map<String, Object>> animalQuestions = Arrays.asList(
                                createQuestion("What type of animal is a frog?",
                                                Arrays.asList("Reptile", "Mammal", "Amphibian", "Fish"), "Amphibian"),
                                createQuestion("What is the largest land animal?",
                                                Arrays.asList("Rhinoceros", "Elephant", "Giraffe", "Hippopotamus"),
                                                "Elephant"),
                                createQuestion("What do herbivores eat?",
                                                Arrays.asList("Meat", "Plants", "Both", "Insects"), "Plants"),
                                createQuestion("Which animal is known as the King of the Jungle?",
                                                Arrays.asList("Tiger", "Lion", "Leopard", "Cheetah"), "Lion"),
                                createQuestion("How do fish breathe?", Arrays.asList("Lungs", "Skin", "Gills", "Nose"),
                                                "Gills"),
                                createQuestion("What is a group of lions called?",
                                                Arrays.asList("Pack", "Herd", "Pride", "Flock"), "Pride"),
                                createQuestion("Which animal has the longest neck?",
                                                Arrays.asList("Elephant", "Giraffe", "Camel", "Ostrich"), "Giraffe"),
                                createQuestion("What is the fastest land animal?",
                                                Arrays.asList("Lion", "Horse", "Cheetah", "Deer"), "Cheetah"),
                                createQuestion("What are warm-blooded animals called?",
                                                Arrays.asList("Reptiles", "Amphibians", "Mammals", "Fish"), "Mammals"),
                                createQuestion("What is metamorphosis?",
                                                Arrays.asList("A type of disease",
                                                                "Change in body form during development",
                                                                "A type of movement", "A way of breathing"),
                                                "Change in body form during development"));
                bank.put("animals", animalQuestions);
                bank.put("zoology", animalQuestions);

                // ===== PHYSICS =====
                List<Map<String, Object>> physicsQuestions = Arrays.asList(
                                createQuestion("What is the SI unit of force?",
                                                Arrays.asList("Joule", "Watt", "Newton", "Pascal"), "Newton"),
                                createQuestion("What is the speed of light approximately?",
                                                Arrays.asList("300,000 km/s", "150,000 km/s", "450,000 km/s",
                                                                "600,000 km/s"),
                                                "300,000 km/s"),
                                createQuestion("What force pulls objects toward Earth?",
                                                Arrays.asList("Magnetism", "Friction", "Gravity", "Tension"),
                                                "Gravity"),
                                createQuestion("What is the formula for speed?",
                                                Arrays.asList("Mass x Acceleration", "Distance / Time",
                                                                "Force x Distance", "Energy / Power"),
                                                "Distance / Time"),
                                createQuestion("What type of energy is stored in a stretched rubber band?",
                                                Arrays.asList("Kinetic", "Thermal", "Elastic Potential", "Chemical"),
                                                "Elastic Potential"),
                                createQuestion("What is Newton's first law about?", Arrays.asList(
                                                "Force = Mass x Acceleration", "Every action has reaction",
                                                "Objects at rest stay at rest (inertia)", "Energy conservation"),
                                                "Objects at rest stay at rest (inertia)"),
                                createQuestion("What instrument measures temperature?",
                                                Arrays.asList("Barometer", "Thermometer", "Speedometer", "Voltmeter"),
                                                "Thermometer"),
                                createQuestion("What is the unit of electrical resistance?",
                                                Arrays.asList("Ampere", "Volt", "Ohm", "Watt"), "Ohm"),
                                createQuestion("Light travels fastest through which medium?",
                                                Arrays.asList("Water", "Glass", "Air", "Vacuum"), "Vacuum"),
                                createQuestion("What type of mirror is used in car headlights?",
                                                Arrays.asList("Plane", "Convex", "Concave", "Cylindrical"), "Concave"));
                bank.put("physics", physicsQuestions);

                // ===== CHEMISTRY =====
                List<Map<String, Object>> chemistryQuestions = Arrays.asList(
                                createQuestion("What is the chemical symbol for Sodium?",
                                                Arrays.asList("So", "Sd", "Na", "S"), "Na"),
                                createQuestion("What is the pH of a neutral solution?",
                                                Arrays.asList("0", "7", "10", "14"), "7"),
                                createQuestion("What are the building blocks of matter called?",
                                                Arrays.asList("Cells", "Atoms", "Molecules", "Compounds"), "Atoms"),
                                createQuestion("What gas is essential for combustion?",
                                                Arrays.asList("Nitrogen", "Carbon Dioxide", "Oxygen", "Hydrogen"),
                                                "Oxygen"),
                                createQuestion("What is H2SO4?",
                                                Arrays.asList("Hydrochloric Acid", "Sulfuric Acid", "Nitric Acid",
                                                                "Carbonic Acid"),
                                                "Sulfuric Acid"),
                                createQuestion("What is the chemical formula for table salt?",
                                                Arrays.asList("NaOH", "NaCl", "KCl", "CaCl2"), "NaCl"),
                                createQuestion("How many elements are in the periodic table approximately?",
                                                Arrays.asList("92", "108", "118", "150"), "118"),
                                createQuestion("What happens when an acid reacts with a base?",
                                                Arrays.asList("Explosion", "Neutralization (salt + water)",
                                                                "Evaporation", "Freezing"),
                                                "Neutralization (salt + water)"),
                                createQuestion("What is rusting an example of?",
                                                Arrays.asList("Physical change", "Chemical change", "Nuclear change",
                                                                "No change"),
                                                "Chemical change"),
                                createQuestion("Which gas makes up most of Earth's atmosphere?",
                                                Arrays.asList("Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"),
                                                "Nitrogen"));
                bank.put("chemistry", chemistryQuestions);

                // ===== BIOLOGY =====
                List<Map<String, Object>> biologyQuestions = Arrays.asList(
                                createQuestion("What is the basic unit of life?",
                                                Arrays.asList("Atom", "Molecule", "Cell", "Organ"), "Cell"),
                                createQuestion("What does DNA stand for?",
                                                Arrays.asList("Deoxyribonucleic Acid", "Dinitrogen Acid",
                                                                "Dynamic Nuclear Acid", "Dual Nucleic Acid"),
                                                "Deoxyribonucleic Acid"),
                                createQuestion("What organ pumps blood in the human body?",
                                                Arrays.asList("Lungs", "Brain", "Heart", "Liver"), "Heart"),
                                createQuestion("How many chromosomes do humans have?",
                                                Arrays.asList("23", "46", "48", "52"), "46"),
                                createQuestion("What is the largest organ in the human body?",
                                                Arrays.asList("Heart", "Liver", "Skin", "Brain"), "Skin"),
                                createQuestion("What type of blood cells fight infection?",
                                                Arrays.asList("Red blood cells", "White blood cells", "Platelets",
                                                                "Plasma"),
                                                "White blood cells"),
                                createQuestion("What system in the body breaks down food?",
                                                Arrays.asList("Respiratory", "Circulatory", "Digestive", "Nervous"),
                                                "Digestive"),
                                createQuestion("What carries oxygen in the blood?",
                                                Arrays.asList("White blood cells", "Platelets", "Hemoglobin", "Plasma"),
                                                "Hemoglobin"),
                                createQuestion("What is the process by which cells divide?",
                                                Arrays.asList("Osmosis", "Mitosis", "Photosynthesis", "Diffusion"),
                                                "Mitosis"),
                                createQuestion("What part of the brain controls balance?",
                                                Arrays.asList("Cerebrum", "Cerebellum", "Brainstem", "Hypothalamus"),
                                                "Cerebellum"));
                bank.put("biology", biologyQuestions);

                // ===== ENGLISH =====
                List<Map<String, Object>> englishQuestions = Arrays.asList(
                                createQuestion("What is a noun?",
                                                Arrays.asList("Action word", "Describing word", "Person/place/thing",
                                                                "Connecting word"),
                                                "Person/place/thing"),
                                createQuestion("What is the past tense of 'run'?",
                                                Arrays.asList("Runned", "Ran", "Running", "Runs"), "Ran"),
                                createQuestion("What is a synonym for 'happy'?",
                                                Arrays.asList("Sad", "Joyful", "Angry", "Tired"), "Joyful"),
                                createQuestion("What is an adjective?",
                                                Arrays.asList("Action word", "Describing word", "Person/place/thing",
                                                                "Connecting word"),
                                                "Describing word"),
                                createQuestion("What is the plural of 'child'?",
                                                Arrays.asList("Childs", "Children", "Childes", "Childrens"),
                                                "Children"),
                                createQuestion("What is a verb?",
                                                Arrays.asList("Action word", "Describing word", "Person/place/thing",
                                                                "Connecting word"),
                                                "Action word"),
                                createQuestion("What is the past tense of 'go'?",
                                                Arrays.asList("Goed", "Gone", "Went", "Going"), "Went"),
                                createQuestion("What is the plural of 'mouse'?",
                                                Arrays.asList("Mouses", "Mice", "Meese", "Mices"), "Mice"),
                                createQuestion("What is the superlative form of 'good'?",
                                                Arrays.asList("Gooder", "Goodest", "Better", "Best"), "Best"),
                                createQuestion("What is a compound word?",
                                                Arrays.asList("Sunshine", "Beautiful", "Running", "Quickly"),
                                                "Sunshine"));
                bank.put("english", englishQuestions);

                // ===== GRAMMAR =====
                List<Map<String, Object>> grammarQuestions = Arrays.asList(
                                createQuestion("What is the past tense of 'eat'?",
                                                Arrays.asList("Eated", "Ate", "Eaten", "Eating"), "Ate"),
                                createQuestion("Which sentence is grammatically correct?",
                                                Arrays.asList("He don't like it", "He doesn't like it",
                                                                "He not like it", "He no like it"),
                                                "He doesn't like it"),
                                createQuestion("What is a pronoun?",
                                                Arrays.asList("A word replacing a noun", "An action word",
                                                                "A describing word", "A connecting word"),
                                                "A word replacing a noun"),
                                createQuestion("What punctuation ends a question?",
                                                Arrays.asList("Period (.)", "Comma (,)", "Question mark (?)",
                                                                "Exclamation (!)"),
                                                "Question mark (?)"),
                                createQuestion("Which word is a preposition?",
                                                Arrays.asList("Run", "Happy", "Under", "Quickly"), "Under"),
                                createQuestion("What is present continuous tense of 'play'?",
                                                Arrays.asList("Played", "Plays", "Is playing", "Will play"),
                                                "Is playing"),
                                createQuestion("What is a conjunction?",
                                                Arrays.asList("A naming word", "A describing word", "A joining word",
                                                                "An action word"),
                                                "A joining word"),
                                createQuestion("Identify the adverb: 'She runs quickly.'",
                                                Arrays.asList("She", "runs", "quickly", "None"), "quickly"),
                                createQuestion("What is the opposite of 'prefix'?",
                                                Arrays.asList("Suffix", "Infix", "Postfix", "None"), "Suffix"),
                                createQuestion("What type of noun is 'happiness'?", Arrays.asList("Proper noun",
                                                "Common noun", "Abstract noun", "Collective noun"), "Abstract noun"));
                bank.put("grammar", grammarQuestions);

                // ===== HISTORY =====
                List<Map<String, Object>> historyQuestions = Arrays.asList(
                                createQuestion("Who was the first President of India?",
                                                Arrays.asList("Jawaharlal Nehru", "Dr. Rajendra Prasad",
                                                                "Mahatma Gandhi", "Sardar Patel"),
                                                "Dr. Rajendra Prasad"),
                                createQuestion("In which year did India gain independence?",
                                                Arrays.asList("1945", "1947", "1950", "1952"), "1947"),
                                createQuestion("Who is known as the Father of the Nation in India?",
                                                Arrays.asList("Nehru", "Gandhi", "Ambedkar", "Patel"), "Gandhi"),
                                createQuestion("Who built the Taj Mahal?",
                                                Arrays.asList("Akbar", "Shah Jahan", "Aurangzeb", "Humayun"),
                                                "Shah Jahan"),
                                createQuestion("When was the Indian Constitution adopted?",
                                                Arrays.asList("1947", "1948", "1949", "1950"), "1949"),
                                createQuestion("Who wrote the Indian National Anthem?",
                                                Arrays.asList("Tagore", "Bankim Chandra", "Iqbal", "Nehru"), "Tagore"),
                                createQuestion("What is the national animal of India?",
                                                Arrays.asList("Lion", "Tiger", "Elephant", "Peacock"), "Tiger"),
                                createQuestion("Who was the first woman Prime Minister of India?",
                                                Arrays.asList("Indira Gandhi", "Pratibha Patil", "Sonia Gandhi",
                                                                "Sarojini Naidu"),
                                                "Indira Gandhi"),
                                createQuestion("In which city is India Gate located?",
                                                Arrays.asList("Mumbai", "Kolkata", "New Delhi", "Chennai"),
                                                "New Delhi"),
                                createQuestion("What was the ancient name of India?",
                                                Arrays.asList("Hindustan", "Bharat", "Aryavarta", "All of these"),
                                                "All of these"));
                bank.put("history", historyQuestions);

                return bank;
        }

        // Dynamic template-based question generator for ANY topic
        private List<Map<String, Object>> generateDynamicQuestions(String title, String category) {
                String displayTitle = (title != null && !title.isEmpty())
                                ? title.substring(0, 1).toUpperCase() + title.substring(1)
                                : "This topic";
                String displayCategory = (category != null && !category.isEmpty())
                                ? category.substring(0, 1).toUpperCase() + category.substring(1)
                                : "General Knowledge";

                return Arrays.asList(
                                createQuestion(
                                                "What is " + displayTitle + "?",
                                                Arrays.asList(
                                                                "A concept in " + displayCategory,
                                                                "A type of mathematical formula",
                                                                "A historical event from the 18th century",
                                                                "A geographic location in Asia"),
                                                "A concept in " + displayCategory),
                                createQuestion(
                                                "Which of the following is most closely related to " + displayTitle
                                                                + "?",
                                                Arrays.asList(
                                                                displayCategory + " fundamentals",
                                                                "Ancient Roman architecture",
                                                                "Modern music theory",
                                                                "Computer programming languages"),
                                                displayCategory + " fundamentals"),
                                createQuestion(
                                                "In the context of " + displayCategory + ", what role does "
                                                                + displayTitle + " play?",
                                                Arrays.asList(
                                                                "It is a fundamental concept",
                                                                "It is completely unrelated",
                                                                "It is used only in cooking",
                                                                "It is a type of sport"),
                                                "It is a fundamental concept"),
                                createQuestion(
                                                "Why is studying " + displayTitle + " important?",
                                                Arrays.asList(
                                                                "It builds foundational knowledge in "
                                                                                + displayCategory,
                                                                "It is not important at all",
                                                                "It only matters for professional athletes",
                                                                "It is useful only for entertainment"),
                                                "It builds foundational knowledge in " + displayCategory),
                                createQuestion(
                                                "Which subject area does " + displayTitle + " belong to?",
                                                Arrays.asList(
                                                                displayCategory,
                                                                "Music",
                                                                "Sports",
                                                                "Cooking"),
                                                displayCategory),
                                createQuestion(
                                                "What would a student learn first when studying " + displayTitle + "?",
                                                Arrays.asList(
                                                                "The basic definitions and concepts",
                                                                "How to play musical instruments",
                                                                "Advanced rocket science formulas",
                                                                "Foreign language grammar rules"),
                                                "The basic definitions and concepts"),
                                createQuestion(
                                                "Which of these is a key term associated with " + displayTitle + "?",
                                                Arrays.asList(
                                                                displayTitle,
                                                                "Cryptocurrency mining",
                                                                "Deep sea diving",
                                                                "Pottery making"),
                                                displayTitle),
                                createQuestion(
                                                "How is " + displayTitle + " typically taught in schools?",
                                                Arrays.asList(
                                                                "Through " + displayCategory + " classes and textbooks",
                                                                "Only through sports practice",
                                                                "It is never taught in schools",
                                                                "Through dance lessons"),
                                                "Through " + displayCategory + " classes and textbooks"),
                                createQuestion(
                                                "What is a practical application of " + displayTitle + "?",
                                                Arrays.asList(
                                                                "Understanding real-world " + displayCategory
                                                                                + " problems",
                                                                "Building time machines",
                                                                "Communicating with aliens",
                                                                "Predicting lottery numbers"),
                                                "Understanding real-world " + displayCategory + " problems"),
                                createQuestion(
                                                "If a teacher assigns a project on " + displayTitle
                                                                + ", which resource would be most helpful?",
                                                Arrays.asList(
                                                                "A " + displayCategory + " textbook or encyclopedia",
                                                                "A recipe book",
                                                                "A car repair manual",
                                                                "A fashion magazine"),
                                                "A " + displayCategory + " textbook or encyclopedia"));
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

                        List<Map<String, Object>> questions = objectMapper.readValue(test.getQuestions(),
                                        new TypeReference<>() {
                                        });
                        List<Map<String, Object>> studentAnswers = objectMapper.readValue(submission.getAnswers(),
                                        new TypeReference<>() {
                                        });

                        int score = 0;
                        List<Map<String, Object>> evaluation = new ArrayList<>();

                        for (int i = 0; i < questions.size(); i++) {
                                Map<String, Object> question = questions.get(i);
                                String correctAnswer = (String) question.get("correctAnswer");
                                String studentAnswer = i < studentAnswers.size()
                                                ? (String) studentAnswers.get(i).get("answer")
                                                : "";

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

        // DEBUG METHODS
        public List<Test> getAllTestsDebug() {
                return testRepository.findAll();
        }

        public List<Assignment> getAllAssignmentsDebug() {
                return assignmentRepository.findAll();
        }
}
