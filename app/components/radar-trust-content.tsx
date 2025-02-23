'use client';

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Shield, Sparkles } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function RadarTrustContent() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="space-y-6">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.5 }}
        variants={fadeInUp}
      >
        <h2 className="text-3xl font-bold mb-4">
          <span className="text-primary">RadarTrust™</span>
          <br />
          The AI Industry&apos;s Benchmark for Quality
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-6">
          Our proprietary <strong>RadarTrust™</strong> score
          empowers businesses and professionals to make data-driven
          decisions when selecting AI tools. We analyze key factors
          like{" "}
          <strong>
            user feedback, innovation, reliability, and market
            adoption{" "}
          </strong>
          to ensure you invest in the most effective and trustworthy
          solutions.
        </p>
      </motion.div>

      <div className="space-y-4">
        {[
          {
            icon: Star,
            title: "User Reviews & Credibility",
            description: "Authentic feedback and ratings from real users who have experienced the tools firsthand.",
            delay: 0.2
          },
          {
            icon: Sparkles,
            title: "Innovation & Technological Edge",
            description: "Assessment of unique features, technological advancement, and problem-solving capabilities.",
            delay: 0.4
          },
          {
            icon: Shield,
            title: "Reliability & Performance",
            description: "A deep dive into uptime, support quality, and long-term stability, ensuring seamless business operations.",
            delay: 0.6
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInUp}
            transition={{ duration: 0.5, delay: item.delay }}
          >
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mt-1">
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {item.title}
              </h3>
              <p className="text-muted-foreground">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 