"use client";

import { Button } from "@/components/ui/button";
import { NavigationHeader } from "@/components/navigation/header";
import { LogoIcon } from "@/components/icons/logo";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useInView, 
  useMotionValue,
  useVelocity,
  AnimatePresence,
  useAnimationFrame
} from "framer-motion";
import { useLenis } from "lenis/react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Lenis scroll control
  const lenis = useLenis();

  return (
    <div ref={containerRef} className="min-h-screen bg-background">
      {/* Fixed elements */}
      <NavigationHeader />
      <ScrollProgress progress={smoothProgress} />
      
      {/* Hero Section with immersive entrance */}
      <HeroSection scrollY={scrollY} />
      
      {/* Interactive Model Showcase */}
      <ModelShowcaseSection scrollProgress={smoothProgress} />
      
      {/* Text-to-Image Section with parallax */}
      <TextToImageSection scrollProgress={smoothProgress} scrollY={scrollY} />
      
      {/* Image Transformations with 3D effects */}
      <ImageTransformationsSection scrollProgress={smoothProgress} />
      
      {/* Video Generation with timeline */}
      <VideoGenerationSection scrollProgress={smoothProgress} scrollY={scrollY} />
      
      {/* Audio Synthesis with waveform */}
      <AudioSynthesisSection scrollProgress={smoothProgress} />
      
      {/* Workflow Chaining with node editor */}
      <WorkflowChainingSection scrollProgress={smoothProgress} />
      
      {/* Testimonials with auto-scroll */}
      <TestimonialsSection scrollProgress={smoothProgress} />
      
      {/* Final CTA with confetti */}
      <FinalCTASection />
    </div>
  );
}

// Scroll progress indicator
function ScrollProgress({ progress }: { progress: any }) {
  const scaleX = useTransform(progress, [0, 1], [0, 1]);
  
  return (
    <motion.div 
      className="fixed top-0 left-0 right-0 h-1 bg-border/20 z-50"
      style={{ transformOrigin: "0%" }}
    >
      <motion.div 
        className="h-full bg-gradient-to-r from-primary to-accent"
        style={{ scaleX }}
      />
    </motion.div>
  );
}

function HeroSection({ scrollY }: { scrollY: any }) {
  const [activeModel, setActiveModel] = useState(0);
  const models = [
    { name: "flux-pro", type: "image", color: "primary" },
    { name: "stable-diffusion-3", type: "image", color: "accent" },
    { name: "llama-vision", type: "vision", color: "chart-3" },
    { name: "whisper-large-v3", type: "audio", color: "chart-4" }
  ];
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  // Parallax transforms
  const y = useTransform(scrollY, [0, 1000], [0, -300]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scale = useTransform(scrollY, [0, 400], [1, 0.8]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModel((prev) => (prev + 1) % models.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.section 
      className="h-screen flex items-center justify-center px-6 pt-14 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ y, opacity, scale }}
    >
      {/* Dynamic background orbs */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-[600px] h-[600px] rounded-full opacity-30 blur-3xl
              ${i === 0 ? 'bg-primary/20' : i === 1 ? 'bg-accent/20' : 'bg-chart-3/20'}
            `}
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -100, 100, 0],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${10 + i * 20}%`
            }}
          />
        ))}
      </div>
      
      <motion.div 
        className="max-w-5xl mx-auto w-full text-center relative z-10"
        style={{
          perspective: "1000px",
          rotateX,
          rotateY,
        }}
      >
        {/* 3D Animated logo */}
        <motion.div 
          className="mb-8 flex justify-center"
          initial={{ y: 100, opacity: 0, rotateX: -90 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          transition={{ 
            delay: 0.2, 
            duration: 1.2,
            type: "spring",
            stiffness: 100
          }}
        >
          <motion.div
            animate={{ 
              rotateY: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <LogoIcon className="h-24 w-24 text-primary" />
          </motion.div>
        </motion.div>

        {/* Main Title with stagger */}
        <motion.div className="mb-8">
          <motion.h1 className="text-7xl md:text-8xl lg:text-9xl font-heading font-bold tracking-tight">
            {"Natural language to".split(" ").map((word, i) => (
              <motion.span
                key={i}
                className="inline-block mr-4"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  delay: 0.4 + i * 0.1, 
                  duration: 0.8,
                  type: "spring",
                  stiffness: 120
                }}
              >
                {word}
              </motion.span>
            ))}
            <br />
            <motion.span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-chart-3"
              initial={{ y: 100, opacity: 0, scale: 0.8 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8, 
                duration: 1,
                type: "spring",
                stiffness: 100
              }}
              style={{
                backgroundSize: "200% 200%",
                animation: "gradient 4s ease infinite"
              }}
            >
              creative AI
            </motion.span>
          </motion.h1>
        </motion.div>

        {/* Typewriter description */}
        <TypewriterText 
          text="Transform ideas into images, videos, and audio through conversation. Powered by fal.ai's lightning-fast models."
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          delay={1.2}
        />

        {/* Model showcase with glow */}
        <motion.div 
          className="mb-16 relative"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          <motion.div 
            className="absolute inset-0 blur-xl opacity-50"
            animate={{
              background: [
                `radial-gradient(circle, oklch(var(--primary)) 0%, transparent 70%)`,
                `radial-gradient(circle, oklch(var(--accent)) 0%, transparent 70%)`,
                `radial-gradient(circle, oklch(var(--chart-3)) 0%, transparent 70%)`,
                `radial-gradient(circle, oklch(var(--chart-4)) 0%, transparent 70%)`,
              ]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <div className="relative inline-flex items-center gap-2 px-8 py-4 bg-background/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-2xl">
            <span className="text-sm text-muted-foreground font-mono">await fal.run("</span>
            <AnimatePresence mode="wait">
              <motion.span 
                className={`text-sm font-mono font-medium text-${models[activeModel].color}`}
                key={activeModel}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.8 }}
                transition={{ duration: 0.4, type: "spring" }}
              >
                {models[activeModel].name}
              </motion.span>
            </AnimatePresence>
            <span className="text-sm font-mono text-muted-foreground">")</span>
          </div>
        </motion.div>

        {/* CTA Buttons with magnetic effect */}
        <motion.div 
          className="flex flex-wrap gap-6 justify-center mb-20"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
        >
          <MagneticButton>
            <Link href="/docs">
              <Button variant="primary" size="xl" className="text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href="https://github.com/fal-ai/fal-mcp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="default" size="xl" className="text-lg px-8 py-4">
                View on GitHub
              </Button>
            </a>
          </MagneticButton>
        </motion.div>

        {/* Floating particles */}
        <FloatingParticles />
      </motion.div>
      
      {/* Advanced scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        <ScrollIndicator />
      </motion.div>
    </motion.section>
  );
}

// Model showcase section
function ModelShowcaseSection({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-200px" });
  
  const models = [
    { id: "flux-pro", name: "FLUX Pro", description: "State-of-the-art image generation", icon: "🎨" },
    { id: "stable-diffusion-3", name: "Stable Diffusion 3", description: "Fast and versatile creativity", icon: "🖼️" },
    { id: "llama-vision", name: "LLaMA Vision", description: "Multi-modal understanding", icon: "👁️" },
    { id: "whisper-large-v3", name: "Whisper v3", description: "Advanced speech recognition", icon: "🎤" },
  ];
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-6">
            Lightning-fast <span className="text-primary">AI Models</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access cutting-edge models through simple natural language commands
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, index) => (
            <InteractiveModelCard key={model.id} model={model} index={index} isInView={isInView} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TextToImageSection({ scrollProgress, scrollY }: { scrollProgress: any; scrollY: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  // Advanced parallax
  const y = useTransform(scrollY, [0, 2000], [0, -400]);
  const scale = useTransform(scrollProgress, [0, 0.5], [0.8, 1]);
  const imageY = useTransform(scrollY, [0, 2000], [0, 200]);
  const codeX = useTransform(scrollProgress, [0.2, 0.4], [-100, 0]);
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      {/* Parallax background elements */}
      <motion.div 
        className="absolute inset-0 opacity-5"
        style={{ y: imageY }}
      >
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h2 
            className="text-5xl md:text-6xl font-heading font-bold mb-8"
            whileHover={{ x: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Text to <GradientText>Image</GradientText>
          </motion.h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Transform your wildest ideas into stunning visuals with just a description. 
            From photorealistic portraits to abstract art, our models understand nuance and style.
          </p>
          
          <motion.div 
            className="space-y-4 mb-8"
            style={{ x: codeX }}
          >
            <InteractiveCodeBlock 
              code='await fal.run("flux-pro", {\n  prompt: "A majestic dragon soaring over a cyberpunk city at sunset",\n  image_size: "landscape_4_3",\n  num_inference_steps: 28,\n  guidance_scale: 3.5\n});'
            />
          </motion.div>
          
          <div className="flex gap-4">
            <MagneticButton>
              <Button variant="primary">Try Text-to-Image</Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="default">View Examples</Button>
            </MagneticButton>
          </div>
        </motion.div>
        
        <motion.div
          className="relative"
          style={{ scale, y }}
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <ParallaxImageGrid images={textToImageExamples} scrollY={scrollY} />
        </motion.div>
      </div>
    </motion.section>
  );
}

function ImageTransformationsSection({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const y = useTransform(scrollProgress, [0.2, 0.8], [50, -50]);
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-muted/20"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          className="order-2 lg:order-1"
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <TransformationShowcase />
        </motion.div>
        
        <motion.div
          className="order-1 lg:order-2"
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8">
            Image <span className="text-accent">Transformations</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Enhance, modify, and perfect your images with AI precision. 
            Remove backgrounds, upscale resolution, or completely transform style and composition.
          </p>
          
          <div className="grid grid-cols-1 gap-6 mb-8">
            {transformationTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                className="p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-border/50"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <h3 className="font-semibold text-lg mb-2">{tool.name}</h3>
                <p className="text-muted-foreground text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="flex gap-4">
            <Button variant="primary">Explore Tools</Button>
            <Button variant="default">See Transformations</Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function VideoGenerationSection({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const scale = useTransform(scrollProgress, [0.4, 0.8], [0.9, 1.1]);
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-chart-3/10 via-transparent to-chart-4/10"
        style={{ scale }}
      />
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8">
            Bring Images to <span className="text-chart-3">Life</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Transform static images into dynamic videos or generate entirely new video content from text descriptions. 
            Create motion, tell stories, and captivate audiences.
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <motion.div
            className="text-left"
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Text to Video</h3>
            <p className="text-muted-foreground mb-6">
              Describe a scene and watch it come to life in high-quality video format.
            </p>
            <CodeBlock 
              code='await fal.run("text-to-video", {\n  prompt: "A time-lapse of a flower blooming in a garden",\n  duration: 5\n});'
            />
          </motion.div>
          
          <motion.div
            className="text-left"
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="text-2xl font-heading font-bold mb-4">Image to Video</h3>
            <p className="text-muted-foreground mb-6">
              Animate your existing images with realistic motion and transitions.
            </p>
            <CodeBlock 
              code='await fal.run("image-to-video", {\n  image_url: "photo.jpg",\n  motion_strength: 0.8\n});'
            />
          </motion.div>
        </div>
        
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button variant="primary" size="xl" className="mr-4">
            Generate Video
          </Button>
          <Button variant="default" size="xl">
            View Gallery
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}

function AudioSynthesisSection({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const y = useTransform(scrollProgress, [0.6, 1], [0, -100]);
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 bg-muted/30"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-12 items-start">
        <motion.div
          className="lg:col-span-2"
          initial={{ x: -100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-heading font-bold mb-8">
            Audio <span className="text-chart-4">Synthesis</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Create natural-sounding speech, generate music, or transform audio with AI precision. 
            Support for 100+ languages and multiple voice styles.
          </p>
          
          <div className="grid gap-8">
            {audioTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                className="p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50"
                initial={{ y: 30, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              >
                <h3 className="text-xl font-heading font-bold mb-3">{tool.name}</h3>
                <p className="text-muted-foreground mb-4">{tool.description}</p>
                <CodeBlock code={tool.code} small />
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        <motion.div
          className="space-y-6"
          initial={{ x: 100, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <AudioWaveform />
          <div className="text-center">
            <Button variant="primary" className="mb-4 w-full">
              Try Audio Tools
            </Button>
            <p className="text-sm text-muted-foreground">
              Real-time processing with studio-quality output
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function WorkflowChainingSection({ scrollProgress }: { scrollProgress: any }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20"
    >
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8">
            Chain <span className="text-chart-5">Workflows</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
            Combine multiple AI operations into powerful workflows. 
            From concept to polished content, automate your entire creative pipeline.
          </p>
        </motion.div>
        
        <WorkflowDiagram isInView={isInView} />
        
        <motion.div
          className="mt-16"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <CodeBlock 
            code={`await fal.run("workflow-chain", {
  steps: [
    { tool: "text-to-image", prompt: "A serene landscape" },
    { tool: "upscale-image", scale: 4 },
    { tool: "background-removal" },
    { tool: "image-to-video", duration: 5 }
  ]
});`}
            large
          />
          
          <div className="mt-12">
            <Button variant="primary" size="xl" className="mr-4">
              Build Workflow
            </Button>
            <Button variant="default" size="xl">
              View Templates
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.section 
      ref={ref}
      className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-chart-3/10"
        animate={{ 
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={isInView ? { scale: 1, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-6xl md:text-7xl font-heading font-bold mb-8">
            Ready to <span className="text-primary">Create</span>?
          </h2>
          <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
            Join thousands of creators using fal-mcp to bring their ideas to life. 
            Start building with AI-powered tools today.
          </p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {finalStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50"
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
            >
              <div className="text-4xl font-bold text-foreground mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center"
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link href="/docs">
            <Button variant="primary" size="xl" className="text-lg px-12 py-4">
              Get Started Now
            </Button>
          </Link>
          <Link href="/docs/tools">
            <Button variant="default" size="xl" className="text-lg px-12 py-4">
              Explore Tools
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}

// Helper Components
function CodeBlock({ code, small = false, large = false }: { code: string; small?: boolean; large?: boolean }) {
  return (
    <div className={`bg-muted/80 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden ${
      small ? 'text-xs' : large ? 'text-base' : 'text-sm'
    }`}>
      <div className="p-4">
        <pre className="text-left overflow-x-auto">
          <code className="font-mono text-foreground whitespace-pre">{code}</code>
        </pre>
      </div>
    </div>
  );
}

function ImageGrid({ images }: { images: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => (
        <motion.div
          key={index}
          className="aspect-square bg-muted/50 rounded-lg border border-border/50 flex items-center justify-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-muted-foreground font-mono text-sm">{image}</span>
        </motion.div>
      ))}
    </div>
  );
}

function TransformationShowcase() {
  const [activeTransform, setActiveTransform] = useState(0);
  const transforms = ['Original', 'Background Removed', 'Upscaled 4x', 'Style Transfer'];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTransform((prev) => (prev + 1) % transforms.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="relative">
      <div className="aspect-square bg-muted/50 rounded-xl border border-border/50 flex items-center justify-center mb-4">
        <motion.span 
          className="text-muted-foreground font-mono"
          key={activeTransform}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {transforms[activeTransform]}
        </motion.span>
      </div>
      <div className="flex justify-center gap-2">
        {transforms.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeTransform ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function AudioWaveform() {
  return (
    <div className="p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50">
      <div className="flex items-center justify-center h-32 gap-1">
        {Array.from({ length: 20 }, (_, i) => (
          <motion.div
            key={i}
            className="w-2 bg-chart-4 rounded-full"
            animate={{
              height: [10, 40, 20, 60, 30, 10]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Real-time audio visualization
      </p>
    </div>
  );
}

function WorkflowDiagram({ isInView }: { isInView: boolean }) {
  const steps = [
    { name: 'Text Prompt', icon: '📝' },
    { name: 'Generate Image', icon: '🎨' },
    { name: 'Enhance Quality', icon: '✨' },
    { name: 'Add Motion', icon: '🎬' },
    { name: 'Final Output', icon: '🎯' }
  ];
  
  return (
    <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
      {steps.map((step, index) => (
        <motion.div
          key={step.name}
          className="flex flex-col items-center"
          initial={{ y: 50, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl mb-3">
            {step.icon}
          </div>
          <span className="text-sm font-medium text-center">{step.name}</span>
          {index < steps.length - 1 && (
            <motion.div 
              className="hidden md:block absolute h-0.5 bg-border w-8 ml-24 mt-8"
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}

// New interactive components
function TypewriterText({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (!isInView) return;
    
    const timeout = setTimeout(() => {
      setIsTyping(true);
      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);
      
      return () => clearInterval(interval);
    }, delay * 1000);
    
    return () => clearTimeout(timeout);
  }, [isInView, text, delay]);
  
  return (
    <motion.p ref={ref} className={className}>
      {displayedText}
      {isTyping && (
        <motion.span
          className="inline-block w-0.5 h-6 bg-primary ml-1"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </motion.p>
  );
}

function MagneticButton({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function ScrollIndicator() {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <motion.div 
      className="relative"
      animate={{ opacity: scrolled ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
        <motion.div 
          className="w-1 h-3 bg-primary rounded-full mt-2"
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <motion.div 
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll to explore
      </motion.div>
    </motion.div>
  );
}

function GradientText({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
      {children}
    </span>
  );
}

function InteractiveModelCard({ model, index, isInView }: any) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.1 * index }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <motion.div
        className="p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50 h-full"
        whileHover={{ scale: 1.02, y: -5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.div 
          className="text-4xl mb-4"
          animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
          transition={{ duration: 0.5 }}
        >
          {model.icon}
        </motion.div>
        <h3 className="text-xl font-heading font-semibold mb-2">{model.name}</h3>
        <p className="text-muted-foreground text-sm mb-4">{model.description}</p>
        <motion.div 
          className="text-xs font-mono text-primary/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          fal.run("{model.id}")
        </motion.div>
      </motion.div>
      
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl blur-xl -z-10"
        animate={{ opacity: isHovered ? 0.5 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function InteractiveCodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <motion.div 
      className="relative group"
      whileHover={{ scale: 1.01 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <div className="bg-muted/80 backdrop-blur-sm rounded-lg border border-border/50 overflow-hidden">
        <div className="p-4 pr-12">
          <pre className="text-left overflow-x-auto">
            <code className="font-mono text-sm text-foreground whitespace-pre">{code}</code>
          </pre>
        </div>
      </div>
      <motion.button
        className="absolute top-2 right-2 p-2 rounded-md bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleCopy}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-green-500 text-sm"
            >
              ✓
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-muted-foreground text-sm"
            >
              📋
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  );
}

function ParallaxImageGrid({ images, scrollY }: { images: string[]; scrollY: any }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {images.map((image, index) => {
        const yOffset = useTransform(
          scrollY,
          [0, 2000],
          [0, index % 2 === 0 ? -100 : 100]
        );
        
        return (
          <motion.div
            key={index}
            className="relative aspect-square bg-muted/50 rounded-lg border border-border/50 overflow-hidden group"
            style={{ y: yOffset }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
          >
            {/* Placeholder with animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="text-muted-foreground font-mono text-sm"
                animate={{ 
                  opacity: [0.5, 1, 0.5],
                  scale: [0.95, 1, 0.95]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {image}
              </motion.span>
            </div>
            
            {/* Hover overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4"
            >
              <span className="text-xs font-mono text-primary">View example →</span>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Testimonials section
function TestimonialsSection({ scrollProgress }: { scrollProgress: any }) {
  const testimonials = [
    { name: "Sarah Chen", role: "Creative Director", text: "fal-mcp transformed our creative workflow. What used to take hours now happens in seconds." },
    { name: "Marcus Rodriguez", role: "AI Engineer", text: "The API is incredibly fast and the models are state-of-the-art. Perfect for production use." },
    { name: "Emma Thompson", role: "Product Designer", text: "Natural language control makes AI accessible to our entire team, not just developers." },
    { name: "David Kim", role: "Startup Founder", text: "We built our entire product on fal.ai. The reliability and speed are unmatched." },
  ];
  
  const x = useTransform(scrollProgress, [0.7, 1], [0, -1000]);
  
  return (
    <motion.section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-4">
          Loved by <GradientText>Creators</GradientText>
        </h2>
        <p className="text-xl text-muted-foreground text-center">
          Join thousands who are building the future with fal-mcp
        </p>
      </div>
      
      <motion.div className="flex gap-6" style={{ x }}>
        {[...testimonials, ...testimonials].map((testimonial, i) => (
          <motion.div
            key={i}
            className="flex-shrink-0 w-96 p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border/50"
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <p className="text-muted-foreground mb-4 italic">"{testimonial.text}"</p>
            <div>
              <p className="font-semibold">{testimonial.name}</p>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
}

// Add CSS keyframes for gradient animation
const gradientStyle = `
  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

// Data
const textToImageExamples = [
  'Cyberpunk Dragon',
  'Mountain Landscape', 
  'Abstract Portrait',
  'Futuristic City'
];

const transformationTools = [
  {
    name: 'Background Removal',
    description: 'Precisely remove or replace image backgrounds with AI accuracy'
  },
  {
    name: 'Image Upscaling', 
    description: 'Enhance resolution up to 8x while preserving fine details'
  },
  {
    name: 'Style Transfer',
    description: 'Apply artistic styles and transform image aesthetics'
  },
  {
    name: 'Object Removal',
    description: 'Intelligently remove unwanted objects and seamlessly fill gaps'
  }
];

const audioTools = [
  {
    name: 'Text-to-Speech',
    description: 'Generate natural-sounding speech in 100+ languages',
    code: 'await fal.run("text-to-speech", {\n  text: "Hello world!",\n  voice: "natural"\n});'
  },
  {
    name: 'Speech-to-Text', 
    description: 'Transcribe audio with high accuracy and speed',
    code: 'await fal.run("speech-to-text", {\n  audio_url: "recording.mp3"\n});'
  },
  {
    name: 'Music Generation',
    description: 'Create original music from text descriptions',
    code: 'await fal.run("text-to-audio", {\n  prompt: "Upbeat jazz melody"\n});'
  }
];

const finalStats = [
  { value: '27+', label: 'AI Tools Available' },
  { value: '<100ms', label: 'Average Latency' },
  { value: '99.9%', label: 'Uptime Guarantee' }
];

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = gradientStyle;
  document.head.appendChild(style);
}