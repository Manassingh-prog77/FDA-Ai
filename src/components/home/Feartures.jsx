import { motion } from "framer-motion";
import {
  MessageCircle,
  ShieldCheck,  
  Users, 
  FileSearch, 
  ClipboardList, 
  Eye, 
  TrendingDown, 
  Lock ,
} from "lucide-react";

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative rounded-2xl p-6 lg:p-8 
        bg-gradient-to-br from-gray-900/90 to-gray-900/50
        border border-gray-800 hover:border-cyan-500/20
        transition-all duration-500 hover:transform hover:scale-105">
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
      />

      <div className="relative z-10">
        <div className="mb-6 inline-block rounded-full bg-cyan-500/10 p-3">
          <Icon className="w-8 h-8 text-cyan-400" />
        </div>
        <h3 className="text-xl font-bold mb-4 text-white group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "AI Fraud Detection",
      description:
        "Leverage AI-driven algorithms to detect fraudulent transactions and prevent financial losses in real-time.",
      delay: 0.1,
    },
    {
      icon: MessageCircle,
      title: "Fraud Analysis Chatbot",
      description:
        "Chat with our AI-powered assistant to analyze suspicious transactions and get real-time insights on potential fraud risks.",
      delay: 0.2,
    },
    {
      icon: Users,
      title: "User Risk Profiling",
      description:
        "Assess user behavior, transaction history, and risk levels to proactively prevent fraudulent activities.",
      delay: 0.3,
    },
    {
      icon: FileSearch,
      title: "Transaction Monitoring",
      description:
        "Continuously monitor online transactions using machine learning models to flag suspicious activities.",
      delay: 0.4,
    },
  ];

  const subFeatures = [
    {
      icon: ClipboardList,
      title: "Real-Time Fraud Detection",
      description:
        "Utilize advanced algorithms to instantly detect anomalies and prevent fraudulent transactions.",
    },
    {
      icon: Eye,
      title: "Behavioral Analysis",
      description:
        "Analyze user behavior and spending patterns to identify potential fraud before it occurs.",
    },
    {
      icon: TrendingDown,
      title: "Risk Scoring & Alerts",
      description:
        "Assign risk scores to transactions and trigger alerts for high-risk activities, ensuring quick action.",
    },
    {
      icon: Lock,
      title: "Secure Transaction Verification",
      description:
        "Implement multi-layered security checks to ensure the authenticity of online transactions.",
    },
  ];

  return (
    <section className="relative py-20 bg-black overflow-hidden" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Comprehensive Career Guidance powered by advanced artificial
            intelligence
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Sub Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          {subFeatures.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center group">
              <div
                className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-full 
                bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
