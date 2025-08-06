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

// Enhanced training modules with more comprehensive content
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
  {
    title: "Advanced AI Technologies",
    description: "Exploring cutting-edge AI technologies including GPT, Computer Vision, and Robotics",
    order_index: 6,
    duration_minutes: 65,
    ppt_url: "https://docs.google.com/presentation/d/1GmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/JMLsHI8aV0g",
    content: {
      topics: ["Large Language Models", "Computer Vision", "Robotics", "Edge AI"],
      learning_objectives: [
        "Understand the capabilities of Large Language Models like GPT",
        "Explore advanced computer vision applications",
        "Learn about AI-powered robotics in business",
        "Discover edge AI and distributed computing",
      ],
      key_concepts: [
        "Large Language Models (LLMs)",
        "Generative AI",
        "Computer Vision Applications",
        "Robotic Process Automation (RPA)",
        "Edge Computing",
        "AI Hardware Acceleration",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI Data Management",
    description: "Best practices for data collection, preparation, and management in AI systems",
    order_index: 7,
    duration_minutes: 50,
    ppt_url: "https://docs.google.com/presentation/d/1HmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/ua-CiDNNj30",
    content: {
      topics: ["Data Quality", "Data Preprocessing", "Feature Engineering", "Data Privacy"],
      learning_objectives: [
        "Implement data quality assurance processes",
        "Master data preprocessing techniques",
        "Apply feature engineering best practices",
        "Ensure data privacy and security compliance",
      ],
      key_concepts: [
        "Data Quality Assessment",
        "Data Cleaning and Preprocessing",
        "Feature Selection and Engineering",
        "Data Privacy Regulations (GDPR, CCPA)",
        "Data Governance",
        "Synthetic Data Generation",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI Security and Risk Management",
    description: "Understanding AI security threats, vulnerabilities, and risk mitigation strategies",
    order_index: 8,
    duration_minutes: 45,
    ppt_url: "https://docs.google.com/presentation/d/1ImTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/7eh4d6sabA0",
    content: {
      topics: ["AI Security Threats", "Model Vulnerabilities", "Risk Assessment", "Security Frameworks"],
      learning_objectives: [
        "Identify common AI security threats and vulnerabilities",
        "Implement AI model security best practices",
        "Conduct comprehensive AI risk assessments",
        "Apply security frameworks for AI systems",
      ],
      key_concepts: [
        "Adversarial Attacks",
        "Model Poisoning",
        "Privacy Attacks",
        "AI Security Frameworks",
        "Threat Modeling",
        "Secure AI Development",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "AI Performance Monitoring",
    description: "Techniques for monitoring, evaluating, and optimizing AI system performance",
    order_index: 9,
    duration_minutes: 40,
    ppt_url: "https://docs.google.com/presentation/d/1JmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/0yCJMt9Mx9c",
    content: {
      topics: ["Performance Metrics", "Model Monitoring", "A/B Testing", "Continuous Improvement"],
      learning_objectives: [
        "Define and measure AI performance metrics",
        "Implement continuous model monitoring systems",
        "Design and execute A/B tests for AI systems",
        "Establish continuous improvement processes",
      ],
      key_concepts: [
        "Key Performance Indicators (KPIs)",
        "Model Drift Detection",
        "A/B Testing Methodologies",
        "MLOps (Machine Learning Operations)",
        "Performance Dashboards",
        "Automated Retraining",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
  {
    title: "Future of AI and Emerging Trends",
    description: "Exploring the future landscape of AI technology and emerging industry trends",
    order_index: 10,
    duration_minutes: 50,
    ppt_url: "https://docs.google.com/presentation/d/1KmTJ0RcEEFXFHiHn4Ja2hMDgVwBsOxUvkBGtVQs/edit?usp=sharing",
    video_url: "https://www.youtube.com/embed/JMLsHI8aV0g",
    content: {
      topics: ["Emerging Technologies", "Industry Trends", "Future Applications", "Career Preparation"],
      learning_objectives: [
        "Identify emerging AI technologies and their potential impact",
        "Understand current industry trends and market dynamics",
        "Explore future AI applications across industries",
        "Prepare for career opportunities in the AI field",
      ],
      key_concepts: [
        "Quantum Computing and AI",
        "Autonomous Systems",
        "AI in Healthcare and Life Sciences",
        "Sustainable AI",
        "AI Democratization",
        "Future of Work with AI",
      ],
    },
    is_active: true,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  },
]

async function seedEnhancedData() {
  try {
    console.log("🚀 Starting enhanced Firebase data seeding...")

    // Clear existing modules (optional - comment out if you want to keep existing data)
    console.log("🧹 Checking existing modules...")
    const existingModules = await getDocs(collection(db, "training_modules"))
    console.log(`📊 Found ${existingModules.size} existing modules`)

    // Add enhanced training modules
    console.log("📚 Adding enhanced training modules...")
    for (const module of trainingModules) {
      const docRef = await addDoc(collection(db, "training_modules"), module)
      console.log(`✅ Added module: ${module.title} (${module.duration_minutes} min) with ID: ${docRef.id}`)
    }

    console.log("🎉 Enhanced Firebase data seeding completed successfully!")

    // Verify data was added
    console.log("🔍 Verifying enhanced data...")
    const modulesSnapshot = await getDocs(collection(db, "training_modules"))
    console.log(`📊 Total training modules in database: ${modulesSnapshot.size}`)

    // Calculate total training time
    const totalMinutes = trainingModules.reduce((total, module) => total + module.duration_minutes, 0)
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10
    console.log(`⏱️ Total training time: ${totalMinutes} minutes (${totalHours} hours)`)

    process.exit(0)
  } catch (error) {
    console.error("❌ Error seeding enhanced data:", error)
    process.exit(1)
  }
}

// Run the enhanced seed function
seedEnhancedData()
