import type { QuizCategory } from '@/features/quiz/schemas';

export const SUPPLEMENTAL_CATEGORIES: QuizCategory[] = [
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Test your knowledge of prompt design techniques for large language models.',
    questions: [
      {
        id: 1,
        question: 'What is the key difference between few-shot and zero-shot prompting?',
        options: [
          'Few-shot uses a larger model; zero-shot uses a smaller one',
          'Few-shot provides examples in the prompt; zero-shot provides none',
          'Few-shot requires fine-tuning; zero-shot does not',
          'Few-shot is faster; zero-shot is more accurate',
        ],
        correctAnswer: 1,
        explanation:
          'Few-shot prompting includes example input-output pairs inside the prompt itself, giving the model a pattern to follow. Zero-shot prompting asks the model to perform the task with no examples at all.',
      },
      {
        id: 2,
        question: 'Chain-of-thought (CoT) prompting improves model performance primarily by:',
        options: [
          'Reducing the number of tokens in the response',
          'Asking the model to produce shorter answers',
          'Encouraging the model to reason step-by-step before giving a final answer',
          'Adding more training examples to the prompt',
        ],
        correctAnswer: 2,
        explanation:
          'CoT prompting asks the model to decompose complex problems into explicit intermediate reasoning steps. This mirrors how humans solve multi-step problems and significantly improves accuracy on arithmetic, logic, and planning tasks.',
      },
      {
        id: 3,
        question: "Which of the following best describes 'role prompting'?",
        options: [
          'Assigning the model a specific persona or expertise to frame its responses',
          'Restricting the model to a single topic domain',
          'Using RLHF to train the model on a specific role',
          'Limiting response length through role-based access control',
        ],
        correctAnswer: 0,
        explanation:
          "Role prompting instructs the model to adopt a persona (e.g., 'You are a senior security engineer') to prime it with relevant domain knowledge and stylistic expectations before the main request.",
      },
      {
        id: 4,
        question:
          'Setting the temperature parameter to a higher value when calling an LLM will generally:',
        options: [
          'Produce more deterministic and repetitive outputs',
          'Increase the model response speed',
          'Make the model refuse ambiguous requests',
          'Increase output variability and creativity',
        ],
        correctAnswer: 3,
        explanation:
          'Temperature controls how the model samples from its probability distribution. Higher values flatten the distribution, making low-probability tokens more likely and producing more varied, creative — but sometimes less accurate — outputs.',
      },
      {
        id: 5,
        question: 'Prompt injection attacks exploit LLMs by:',
        options: [
          'Overloading the model with too many tokens',
          'Inserting adversarial instructions into user-controlled input to override system instructions',
          'Fine-tuning the model with malicious data',
          'Accessing the model API without authentication',
        ],
        correctAnswer: 1,
        explanation:
          "Prompt injection occurs when attacker-controlled text (e.g., user input or retrieved documents) contains instructions that the model obeys instead of the intended system prompt, potentially causing data leakage or safety bypass. It's analogous to SQL injection but for natural language.",
      },
    ],
  },
  {
    id: 'model-selection',
    title: 'Model Selection',
    description: 'Test your knowledge of choosing the right AI model for different use cases.',
    questions: [
      {
        id: 1,
        question: 'A larger context window in an LLM primarily enables:',
        options: [
          'Faster inference speed due to better parallelism',
          'Processing longer documents or conversation histories in a single request',
          'More accurate responses on short prompts',
          'Lower cost per token',
        ],
        correctAnswer: 1,
        explanation:
          'Context window size determines how many tokens (input + output combined) the model can process at once. A larger window lets you pass full codebases, long documents, or extended conversation histories without truncation.',
      },
      {
        id: 2,
        question:
          'When should you prefer a smaller, less capable model over the most capable one available?',
        options: [
          'When the task requires creative long-form writing',
          'When accuracy is the only priority regardless of cost',
          'When the task is simple, high-volume, and latency-sensitive',
          'When the prompt is longer than 1,000 tokens',
        ],
        correctAnswer: 2,
        explanation:
          'Smaller models are faster and cheaper per token. For high-throughput tasks like classification, extraction, or routing where quality requirements are modest, they often deliver adequate results at a fraction of frontier-model cost.',
      },
      {
        id: 3,
        question:
          'For a real-time voice assistant that must respond within 500 ms, which model characteristic is most critical?',
        options: [
          'Highest benchmark accuracy score',
          'Largest context window available',
          'Low latency and fast time-to-first-token',
          'Support for multimodal inputs',
        ],
        correctAnswer: 2,
        explanation:
          'Real-time applications are latency-constrained. Time-to-first-token (TTFT) and streaming throughput are the primary selection criteria and often outweigh raw accuracy gains from a larger model.',
      },
      {
        id: 4,
        question: 'When is fine-tuning a model generally preferred over prompt engineering alone?',
        options: [
          'When you need the model to follow a specific output format consistently across thousands of calls',
          'When you want to add new factual knowledge published after the training cutoff',
          'When you need a single one-off response',
          'When the base model is too large to deploy locally',
        ],
        correctAnswer: 0,
        explanation:
          'Fine-tuning is most effective for instilling consistent style, tone, or output format at scale. It is not a reliable mechanism for injecting new factual knowledge — retrieval-augmented generation (RAG) is preferred for that.',
      },
      {
        id: 5,
        question:
          'When an application must reliably produce valid JSON from an LLM, the best approach is to:',
        options: [
          'Use the model with the highest parameter count available',
          'Use a model that supports structured output or JSON mode, and validate the result with a schema',
          "Include 'always respond in JSON' in the system prompt with no further enforcement",
          'Replace the LLM with a rule-based system',
        ],
        correctAnswer: 1,
        explanation:
          'Models with constrained decoding or JSON mode dramatically reduce malformed output. Combining this with runtime schema validation (e.g., Zod) at the application boundary ensures reliability that a plain text instruction alone cannot guarantee.',
      },
    ],
  },
];
