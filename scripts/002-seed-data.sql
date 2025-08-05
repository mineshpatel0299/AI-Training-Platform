-- Insert training modules
INSERT INTO training_modules (title, description, order_index, duration_minutes, ppt_url, video_url, content) VALUES
('Introduction to AI', 'Fundamental concepts of Artificial Intelligence and its applications in modern business', 1, 45, '/presentations/intro-to-ai.pdf', 'https://example.com/videos/intro-ai.mp4', '{"topics": ["What is AI", "Types of AI", "AI vs ML", "Business Applications"]}'),
('AI in Insurance', 'How AI is transforming the insurance industry through automation and risk assessment', 2, 60, '/presentations/ai-insurance.pdf', 'https://example.com/videos/ai-insurance.mp4', '{"topics": ["Claims Processing", "Risk Assessment", "Fraud Detection", "Customer Service"]}'),
('AI in Compliance', 'Leveraging AI for regulatory compliance, monitoring, and reporting', 3, 50, '/presentations/ai-compliance.pdf', 'https://example.com/videos/ai-compliance.mp4', '{"topics": ["Regulatory Monitoring", "Automated Reporting", "Risk Management", "Audit Trails"]}'),
('AI Ethics and Governance', 'Understanding ethical considerations and governance frameworks for AI implementation', 4, 40, '/presentations/ai-ethics.pdf', 'https://example.com/videos/ai-ethics.mp4', '{"topics": ["Ethical AI", "Bias Prevention", "Governance Frameworks", "Accountability"]}'),
('AI Implementation Strategy', 'Practical approaches to implementing AI solutions in compliance organizations', 5, 55, '/presentations/ai-strategy.pdf', 'https://example.com/videos/ai-strategy.mp4', '{"topics": ["Implementation Planning", "Change Management", "ROI Measurement", "Best Practices"]}');

-- Insert AI basics videos
INSERT INTO ai_basics_videos (title, description, video_url, thumbnail_url, duration_minutes, order_index) VALUES
('What is Artificial Intelligence?', 'Basic introduction to AI concepts and definitions', 'https://example.com/videos/basics-1.mp4', '/thumbnails/basics-1.jpg', 8, 1),
('Machine Learning Fundamentals', 'Understanding the basics of machine learning', 'https://example.com/videos/basics-2.mp4', '/thumbnails/basics-2.jpg', 10, 2),
('Deep Learning Explained', 'Introduction to neural networks and deep learning', 'https://example.com/videos/basics-3.mp4', '/thumbnails/basics-3.jpg', 12, 3),
('Natural Language Processing', 'How AI understands and processes human language', 'https://example.com/videos/basics-4.mp4', '/thumbnails/basics-4.jpg', 9, 4),
('Computer Vision Basics', 'How AI sees and interprets visual information', 'https://example.com/videos/basics-5.mp4', '/thumbnails/basics-5.jpg', 11, 5),
('AI in Business Applications', 'Real-world applications of AI in business', 'https://example.com/videos/basics-6.mp4', '/thumbnails/basics-6.jpg', 13, 6),
('Data and AI', 'The role of data in AI systems', 'https://example.com/videos/basics-7.mp4', '/thumbnails/basics-7.jpg', 7, 7),
('AI Algorithms Overview', 'Common AI algorithms and their uses', 'https://example.com/videos/basics-8.mp4', '/thumbnails/basics-8.jpg', 15, 8),
('AI Tools and Platforms', 'Popular AI tools and development platforms', 'https://example.com/videos/basics-9.mp4', '/thumbnails/basics-9.jpg', 10, 9),
('Future of AI', 'Trends and future developments in AI technology', 'https://example.com/videos/basics-10.mp4', '/thumbnails/basics-10.jpg', 14, 10);
