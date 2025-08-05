// Firebase seed data script - run this to populate your Firestore database
import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyBrSDt7iBbjlM1rFOwWptJVdczSpKV2IDc",
  authDomain: "ai-compliance-a1386.firebaseapp.com",
  projectId: "ai-compliance-a1386",
  storageBucket: "ai-compliance-a1386.firebasestorage.app",
  messagingSenderId: "596978797207",
  appId: "1:596978797207:web:3cff4811e3611432f577d2",
  measurementId: "G-BRKFEWMHHC",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Update the AI basics videos with more comprehensive content
const aiBasicsVideos = [
  {
    title: "What is Artificial Intelligence?",
    description: "Basic introduction to AI concepts, definitions, and how AI differs from traditional programming",
    video_url: "https://www.youtube.com/embed/ad79nYk2keg",
    thumbnail_url: "/thumbnails/ai-intro.png",
    duration_minutes: 8,
    order_index: 1,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Machine Learning Fundamentals",
    description: "Understanding supervised, unsupervised, and reinforcement learning with real-world examples",
    video_url: "https://www.youtube.com/embed/ukzFI9rgwfU",
    thumbnail_url: "/thumbnails/ml-fundamentals.png",
    duration_minutes: 12,
    order_index: 2,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Deep Learning and Neural Networks",
    description: "Introduction to neural networks, deep learning architectures, and their applications",
    video_url: "https://www.youtube.com/embed/aircAruvnKk",
    thumbnail_url: "/thumbnails/deep-learning.png",
    duration_minutes: 15,
    order_index: 3,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Natural Language Processing (NLP)",
    description: "How AI understands and processes human language, including chatbots and text analysis",
    video_url: "https://www.youtube.com/embed/fOvTtapxa9c",
    thumbnail_url: "/thumbnails/nlp-basics.png",
    duration_minutes: 10,
    order_index: 4,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Computer Vision Explained",
    description: "How AI sees and interprets visual information, from image recognition to autonomous vehicles",
    video_url: "https://www.youtube.com/embed/OcycT1Jwsns",
    thumbnail_url: "/thumbnails/computer-vision.png",
    duration_minutes: 11,
    order_index: 5,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "AI in Business Applications",
    description: "Real-world applications of AI across industries: healthcare, finance, retail, and manufacturing",
    video_url: "https://www.youtube.com/embed/0yCJMt9Mx9c",
    thumbnail_url: "/thumbnails/ai-business.png",
    duration_minutes: 13,
    order_index: 6,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Data Science and AI",
    description: "The critical role of data in AI systems, data quality, and data preprocessing techniques",
    video_url: "https://www.youtube.com/embed/ua-CiDNNj30",
    thumbnail_url: "/thumbnails/data-science.png",
    duration_minutes: 9,
    order_index: 7,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "AI Algorithms and Models",
    description: "Overview of common AI algorithms: decision trees, random forests, SVMs, and neural networks",
    video_url: "https://www.youtube.com/embed/7eh4d6sabA0",
    thumbnail_url: "/thumbnails/ai-algorithms.png",
    duration_minutes: 14,
    order_index: 8,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "AI Ethics and Bias",
    description: "Understanding AI bias, fairness, transparency, and ethical considerations in AI development",
    video_url: "https://www.youtube.com/embed/AaU6tI2pb3M",
    thumbnail_url: "/thumbnails/ai-ethics.png",
    duration_minutes: 12,
    order_index: 9,
    is_active: true,
    created_at: serverTimestamp(),
  },
  {
    title: "Future of AI and Emerging Trends",
    description: "Latest developments in AI: GPT models, autonomous systems, and the future of work",
    video_url: "https://www.youtube.com/embed/JMLsHI8aV0g",
    thumbnail_url: "/thumbnails/ai-future.png",
    duration_minutes: 16,
    order_index: 10,
    is_active: true,
    created_at: serverTimestamp(),
  },
]

// Update training modules with actual video URLs and PPT links
const trainingModules = [
  {
    title: "Introduction to AI",
    description: "Fundamental concepts of Artificial Intelligence and its applications in modern business",
    order_index: 1,
    duration_minutes: 45,
    ppt_url: "https://docs.google.com/presentation/d/1BmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/2ePf9rue1Ao",
    content: {
      topics: ["What is AI", "Types of AI", "AI vs ML", "Business Applications"],
      learning_objectives: [
        "Define artificial intelligence and its core concepts",
        "Distinguish between different types of AI systems",
        "Understand the relationship between AI and machine learning",
        "Identify key business applications of AI technology",
      ],
      key_concepts: [
        "Artificial Intelligence (AI)",
        "Machine Learning (ML)",
        "Deep Learning",
        "Natural Language Processing",
        "Computer Vision",
        "Automation",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI in Insurance",
    description: "How AI is transforming the insurance industry through automation and risk assessment",
    order_index: 2,
    duration_minutes: 60,
    ppt_url: "https://docs.google.com/presentation/d/1CmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/kW_cuhLG0oc",
    content: {
      topics: ["Claims Processing", "Risk Assessment", "Fraud Detection", "Customer Service"],
      learning_objectives: [
        "Understand AI applications in insurance claims processing",
        "Learn how AI enhances risk assessment and underwriting",
        "Explore AI-powered fraud detection techniques",
        "Discover AI improvements in customer service",
      ],
      key_concepts: [
        "Automated Claims Processing",
        "Predictive Risk Modeling",
        "Fraud Detection Algorithms",
        "Chatbots and Virtual Assistants",
        "Telematics",
        "Image Recognition for Claims",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI in Compliance",
    description: "Leveraging AI for regulatory compliance, monitoring, and reporting",
    order_index: 3,
    duration_minutes: 50,
    ppt_url: "https://docs.google.com/presentation/d/1DmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/TU06d7KXwKQ",
    content: {
      topics: ["Regulatory Monitoring", "Automated Reporting", "Risk Management", "Audit Trails"],
      learning_objectives: [
        "Implement AI for continuous regulatory monitoring",
        "Automate compliance reporting processes",
        "Use AI for proactive risk management",
        "Maintain comprehensive audit trails with AI",
      ],
      key_concepts: [
        "RegTech (Regulatory Technology)",
        "Automated Compliance Monitoring",
        "Real-time Risk Assessment",
        "Natural Language Processing for Regulations",
        "Anomaly Detection",
        "Automated Reporting Systems",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI Ethics and Governance",
    description: "Understanding ethical considerations and governance frameworks for AI implementation",
    order_index: 4,
    duration_minutes: 40,
    ppt_url: "https://docs.google.com/presentation/d/1EmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/AaU6tI2pb3M",
    content: {
      topics: ["Ethical AI", "Bias Prevention", "Governance Frameworks", "Accountability"],
      learning_objectives: [
        "Understand key ethical principles in AI development",
        "Identify and mitigate AI bias in systems",
        "Implement AI governance frameworks",
        "Establish accountability measures for AI decisions",
      ],
      key_concepts: [
        "AI Ethics Principles",
        "Algorithmic Bias",
        "Fairness and Transparency",
        "AI Governance",
        "Explainable AI (XAI)",
        "Responsible AI Development",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI Implementation Strategy",
    description: "Practical approaches to implementing AI solutions in compliance organizations",
    order_index: 5,
    duration_minutes: 55,
    ppt_url: "https://docs.google.com/presentation/d/1FmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/t4kyRyKyOpo",
    content: {
      topics: ["Implementation Planning", "Change Management", "ROI Measurement", "Best Practices"],
      learning_objectives: [
        "Develop comprehensive AI implementation plans",
        "Manage organizational change for AI adoption",
        "Measure and demonstrate ROI of AI initiatives",
        "Apply industry best practices for AI deployment",
      ],
      key_concepts: [
        "AI Strategy Development",
        "Change Management",
        "ROI Calculation",
        "Pilot Project Management",
        "Stakeholder Engagement",
        "AI Maturity Assessment",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
]

async function seedData() {
  try {
    console.log("Starting to seed Firebase data...")

    // Add training modules
    console.log("Adding training modules...")
    for (const module of trainingModules) {
      const docRef = await addDoc(collection(db, "training_modules"), module)
      console.log(`✅ Added module: ${module.title} with ID: ${docRef.id}`)
    }

    // Add AI basics videos
    console.log("Adding AI basics videos...")
    for (const video of aiBasicsVideos) {
      const docRef = await addDoc(collection(db, "ai_basics_videos"), video)
      console.log(`✅ Added video: ${video.title} with ID: ${docRef.id}`)
    }

    console.log("🎉 Firebase data seeding completed successfully!")

    // Verify data was added
    console.log("🔍 Verifying data...")
    const videosSnapshot = await getDocs(collection(db, "ai_basics_videos"))
    console.log(`📊 Total AI basics videos in database: ${videosSnapshot.size}`)
  } catch (error) {
    console.error("❌ Error seeding data:", error)
  }
}

// Run the seed function
seedData()
