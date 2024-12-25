import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import {
  BarChart2,
  BookOpen,
  Check,
  Code,
  GitBranch,
  Github,
  MessageSquare,
  Rocket,
  Share2,
  Terminal,
  Users,
} from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/common/Logo";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Route } from "../../src/routes/+types/home";

const isOpenSource = false;

// eslint-disable-next-line no-empty-pattern
export function meta({}: Route.MetaArgs) {
  return [
    { title: "BenchJS - JavaScript Benchmarking" },
    {
      name: "description",
      content: "BenchJS - JavaScript benchmarking in your browser",
    },
  ];
}

// interface PlaygroundLinkProps {
//   children: React.ReactNode;
//   onClick?: () => void;
//   className?: string;
// }
//
// const PlaygroundLink = ({ children, onClick, className = "" }: PlaygroundLinkProps) => (
//   <Link className={className} to="/playground" onClick={onClick}>
//     {children}
//   </Link>
// );

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      className={cn(
        "container overflow-hidden relative py-16 px-12 mx-auto max-w-6xl bg-zinc-100 rounded-3xl dark:bg-zinc-800",
        className,
      )}
      initial="hidden"
      variants={staggerChildren}
    >
      {children}
    </motion.div>
  );
};

const MotionCard = motion(Card);

// const stats = [
//   { number: "10K+", label: "GitHub Stars" },
//   { number: "500K+", label: "Monthly Downloads" },
//   { number: "2K+", label: "Community Members" },
//   { number: "50+", label: "Contributors" },
// ];

const features = [
  {
    icon: <Terminal className="w-6 h-6" />,
    title: "Zero Setup",
    description: "Benchmarking directly in your browser.",
    link: "/docs/getting-started",
  },
  {
    icon: <Code className="w-6 h-6" />,
    title: "TypeScript",
    description: "Use TypeScript with full type safety and modern features.",
    link: "/docs/typescript",
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: "Real-time Analytics",
    description: "Watch your benchmarks run in real-time with detailed performance metrics.",
    link: "/docs/analytics",
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Collaboration",
    description: "Share a link of your benchmark to your team.",
    link: "/docs/sharing",
  },
];

// const useCases = [
//   {
//     icon: <Cpu className="w-8 h-8 text-primary" />,
//     title: "Algorithm Analysis",
//     description: "Compare different algorithmic solutions with precise performance metrics.",
//   },
//   {
//     icon: <Users className="w-8 h-8 text-primary" />,
//     title: "Library Evaluation",
//     description:
//       "Benchmark multiple libraries to choose the most performant solution for your specific use case.",
//   },
//   {
//     icon: <Terminal className="w-8 h-8 text-primary" />,
//     title: "Performance Testing",
//     description:
//       "Integrate performance benchmarks into your CI/CD pipeline to catch performance regressions early.",
//   },
//   {
//     icon: <BookOpen className="w-8 h-8 text-primary" />,
//     title: "Learning Platform",
//     description:
//       "Perfect for educators and students to understand performance implications of different coding patterns.",
//   },
//   {
//     icon: <GitBranch className="w-8 h-8 text-primary" />,
//     title: "Code Reviews",
//     description:
//       "Make performance a first-class citizen in your code reviews with shareable benchmark results.",
//   },
//   {
//     icon: <MessageSquare className="w-8 h-8 text-primary" />,
//     title: "Community",
//     description: "Join our community of performance enthusiasts. Share optimizations and learn from others.",
//   },
// ];

export default function HomePage() {
  const [isNavigating, setIsNavigating] = useState(false);
  const navigate = useNavigate();

  const handleNavigateToPlayground = (e?: React.MouseEvent) => {
    e?.preventDefault();
    setIsNavigating(true);
    setTimeout(() => navigate("/playground"), 500);
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="min-h-screen bg-gradient-to-b to-white from-zinc-50 dark:from-zinc-900 dark:to-zinc-800"
        exit={{ opacity: 0 }}
        initial={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={
            isNavigating ?
              {
                scale: 1.1,
                opacity: 0,
                transition: { duration: 0.5, ease: "easeInOut" },
              }
            : {
                scale: 1,
                opacity: 1,
              }
          }
          initial={false}
        >
          <Header />

          <main className="py-8 px-8 space-y-12 md:px-16">
            {/* hero */}
            <section className="container py-32 px-4 pt-48 mx-auto max-w-7xl">
              <div className="flex flex-col gap-12 items-center lg:flex-row">
                {/* left */}
                <motion.div
                  animate="visible"
                  className="space-y-6 text-center lg:w-1/2 lg:text-left"
                  initial="hidden"
                  variants={fadeInUp}
                >
                  {/* badges */}
                  {/* <div className="flex gap-2 justify-center items-center mb-6 lg:justify-start"> */}
                  {/*   <span className="py-1 px-3 text-sm font-medium text-purple-900 bg-yellow-200 rounded-full dark:text-yellow-200 dark:bg-purple-900/30"> */}
                  {/*     Open Source */}
                  {/*   </span> */}
                  {/*   <a */}
                  {/*     className="flex gap-1 items-center py-1 px-3 text-sm font-medium rounded-full transition-colors bg-zinc-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 hover:bg-zinc-200" */}
                  {/*     href="https://github.com/benchjs/benchjs/stargazers" */}
                  {/*     rel="noopener noreferrer" */}
                  {/*     target="_blank" */}
                  {/*   > */}
                  {/*     <Github className="w-4 h-4" /> */}
                  {/*     <span>Star</span> */}
                  {/*   </a> */}
                  {/* </div> */}

                  {/* logo */}
                  <Logo size="huge" />

                  {/* headings */}
                  {/* <p className="text-xl font-semibold sm:text-2xl md:text-3xl text-zinc-700 dark:text-zinc-300"> */}
                  {/*   Easy JavaScript Benchmarking */}
                  {/* </p> */}
                  <p className="md:text-lg text-zinc-500 dark:text-zinc-400">
                    Run, compare, and share JavaScript benchmarks in your browser.
                  </p>

                  {/* cta */}
                  <div className="flex flex-col gap-4 justify-center sm:flex-row lg:justify-start">
                    <Button className="gap-2 w-full sm:w-auto" size="lg" onClick={handleNavigateToPlayground}>
                      <Rocket className="w-4 h-4" />
                      Enter Playground
                    </Button>
                    {isOpenSource && (
                      <a href="https://github.com/3rd/benchjs" rel="noopener noreferrer" target="_blank">
                        <Button className="gap-2 w-full sm:w-auto" size="lg" variant="outline">
                          <Github className="w-4 h-4" />
                          View Source
                        </Button>
                      </a>
                    )}
                  </div>

                  {/* stats */}
                  {/* <div className="grid grid-cols-2 gap-4 pt-6 md:grid-cols-4"> */}
                  {/*   {stats.map((stat, index) => ( */}
                  {/*     // eslint-disable-next-line react/no-array-index-key */}
                  {/*     <div key={index} className="text-center"> */}
                  {/*       <div className="text-2xl font-bold text-yellow-700 dark:text-purple-400"> */}
                  {/*         {stat.number} */}
                  {/*       </div> */}
                  {/*       <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div> */}
                  {/*     </div> */}
                  {/*   ))} */}
                  {/* </div> */}
                </motion.div>

                {/* right */}
                <motion.div
                  animate="visible"
                  className="lg:w-1/2"
                  initial="hidden"
                  layoutId="editor"
                  variants={fadeInUp}
                >
                  <div className="relative">
                    <motion.div
                      animate={{
                        scale: [1, 1.02, 1],
                        opacity: [0.5, 0.6, 0.5],
                      }}
                      className="absolute inset-0 bg-gradient-to-r rounded-lg from-yellow-700/20 via-pink-600/20 to-blue-600/20 blur-xl"
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    <div className="relative p-6 rounded-lg shadow-2xl bg-black/80">
                      <pre className="font-mono text-sm text-zinc-300">
                        <code>{`// Example benchmark
function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

benchmark("Recursive Fibonacci", () => {
  fibonacci(20);
});`}</code>
                      </pre>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            {/* features */}
            <Section>
              <section className="space-y-8">
                <motion.div className="mx-auto max-w-2xl text-center" variants={fadeInUp}>
                  <h2 className="mb-4 text-3xl font-bold">Features</h2>
                  <p className="text-zinc-600 dark:text-zinc-300">
                    Built with modern web technologies and designed for developers.
                    <br />
                    Every feature is open source and community-driven.
                  </p>
                </motion.div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature, index) => (
                    <MotionCard
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className="h-full bg-white border-none shadow-lg transition-colors backdrop-blur group dark:bg-zinc-900 dark:hover:bg-zinc-800 hover:bg-zinc-50"
                      variants={fadeInUp}
                      whileHover={{ y: -5 }}
                    >
                      <CardHeader>
                        <div className="flex justify-center items-center mb-4 w-12 h-12 bg-yellow-300 rounded-lg transition-colors group-hover:bg-yellow-400 dark:bg-yellow-900/30 dark:group-hover:bg-yellow-900/50">
                          {feature.icon}
                        </div>
                        <CardTitle>{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-zinc-600 dark:text-zinc-300">{feature.description}</p>
                      </CardContent>
                    </MotionCard>
                  ))}
                </div>
              </section>
            </Section>

            {/* community */}
            {/* <Section> */}
            {/*   <section> */}
            {/*     <div className="mx-auto mb-12 max-w-2xl text-center"> */}
            {/*       <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2> */}
            {/*       <p className="text-zinc-600 dark:text-zinc-300"> */}
            {/*         BenchJS is built by the community, for the community. Get involved and help shape the */}
            {/*         future of JavaScript performance testing. */}
            {/*       </p> */}
            {/*     </div> */}
            {/*     <div className="grid gap-8 mx-auto max-w-4xl md:grid-cols-3"> */}
            {/*       <Card className="bg-white shadow-lg dark:bg-zinc-900"> */}
            {/*         <CardHeader> */}
            {/*           <Github className="mb-2 w-8 h-8 text-primary" /> */}
            {/*           <CardTitle>Contribute</CardTitle> */}
            {/*         </CardHeader> */}
            {/*         <CardContent> */}
            {/*           <p className="mb-4 text-zinc-600 dark:text-zinc-300"> */}
            {/*             Help improve BenchJS by contributing code, documentation, or ideas. */}
            {/*           </p> */}
            {/*           <a */}
            {/*             className="text-yellow-700 dark:text-purple-400 hover:underline" */}
            {/*             href="https://github.com/benchjs/benchjs/contribute" */}
            {/*             rel="noopener noreferrer" */}
            {/*             target="_blank" */}
            {/*           > */}
            {/*             View Contributing Guide → */}
            {/*           </a> */}
            {/*         </CardContent> */}
            {/*       </Card> */}
            {/*       <Card className="bg-white shadow-lg dark:bg-zinc-900"> */}
            {/*         <CardHeader> */}
            {/*           <MessageSquare className="mb-2 w-8 h-8 text-primary" /> */}
            {/*           <CardTitle>Discuss</CardTitle> */}
            {/*         </CardHeader> */}
            {/*         <CardContent> */}
            {/*           <p className="mb-4 text-zinc-600 dark:text-zinc-300"> */}
            {/*             Join our Discord community to discuss performance optimization. */}
            {/*           </p> */}
            {/*           <a */}
            {/*             className="text-yellow-700 dark:text-purple-400 hover:underline" */}
            {/*             href="https://discord.gg/benchjs" */}
            {/*             rel="noopener noreferrer" */}
            {/*             target="_blank" */}
            {/*           > */}
            {/*             Join Discord → */}
            {/*           </a> */}
            {/*         </CardContent> */}
            {/*       </Card> */}
            {/*       <Card className="bg-white shadow-lg dark:bg-zinc-900"> */}
            {/*         <CardHeader> */}
            {/*           <BookOpen className="mb-2 w-8 h-8 text-primary" /> */}
            {/*           <CardTitle>Learn</CardTitle> */}
            {/*         </CardHeader> */}
            {/*         <CardContent> */}
            {/*           <p className="mb-4 text-zinc-600 dark:text-zinc-300"> */}
            {/*             Explore our guides and documentation to master performance testing. */}
            {/*           </p> */}
            {/*           <Link className="text-yellow-700 dark:text-purple-400 hover:underline" to="/docs"> */}
            {/*             Read Documentation → */}
            {/*           </Link> */}
            {/*         </CardContent> */}
            {/*       </Card> */}
            {/*     </div> */}
            {/*   </section> */}
            {/* </Section> */}

            {/* how it works */}
            <Section>
              <section>
                <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" />
                <div className="relative">
                  <div className="mx-auto mb-16 max-w-2xl text-center">
                    <h2 className="mb-4 text-3xl font-bold">How It Works</h2>
                    <p className="text-zinc-600 dark:text-zinc-300">
                      Three simple steps to create a kick-ass benchmark.
                    </p>
                  </div>

                  {/* Step 1: Write */}
                  <div className="mx-auto mb-24 max-w-6xl">
                    <div className="flex flex-col gap-12 items-center lg:flex-row">
                      <div className="space-y-6 lg:w-1/2">
                        <div className="flex gap-4 items-center">
                          <div className="flex justify-center items-center w-12 h-12 text-xl font-bold bg-yellow-300 rounded-full text-zinc-800 dark:bg-yellow-900/30">
                            1
                          </div>
                          <h3 className="text-2xl font-bold">Write Your Code</h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          Create benchmarks with TypeScript or JavaScript using our powerful editor.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Full TypeScript support</span>
                          </li>
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Import ESM packages directly</span>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:w-1/2">
                        <div className="p-6 bg-black rounded-lg shadow-xl dark:bg-black">
                          <div className="flex gap-2 items-center mb-4">
                            <div className="w-3 h-3 bg-red-500 rounded-full" />
                            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                          </div>
                          <pre className="font-mono text-sm text-zinc-300">
                            <code>{`// Implementation 1: QuickSort
function quickSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = arr.slice(1)
    .filter(x => x <= pivot);
  const right = arr.slice(1)
    .filter(x => x > pivot);
  return [
    ...quickSort(left),
    pivot,
    ...quickSort(right)
  ];
}`}</code>
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Run */}
                  <div className="mx-auto mb-24 max-w-6xl">
                    <div className="flex flex-col gap-12 items-center lg:flex-row-reverse">
                      <div className="space-y-6 lg:w-1/2">
                        <div className="flex gap-4 items-center">
                          <div className="flex justify-center items-center w-12 h-12 text-xl font-bold bg-yellow-300 rounded-full text-zinc-800 dark:bg-purple-900/30">
                            2
                          </div>
                          <h3 className="text-2xl font-bold">Run Benchmarks</h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          Run the benchmarks and get detailed performance metrics.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Real-time progress tracking</span>
                          </li>
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Detailed metrics</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-6 lg:w-1/2">
                        <div className="p-6 bg-white rounded-lg shadow-xl backdrop-blur dark:bg-zinc-900">
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-2 text-sm">
                                <span className="font-medium">QuickSort</span>
                                <span className="font-bold text-green-700">1,234,567 ops/sec</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <div className="h-2.5 bg-green-700 rounded-full" style={{ width: "100%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-2 text-sm">
                                <span className="font-medium">MergeSort</span>
                                <span className="font-bold text-blue-600">987,654 ops/sec</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <div className="h-2.5 bg-blue-600 rounded-full" style={{ width: "80%" }} />
                              </div>
                            </div>
                            <div>
                              <div className="flex justify-between mb-2 text-sm">
                                <span className="font-medium">BubbleSort</span>
                                <span className="font-bold text-blue-600">567,890 ops/sec</span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <div className="h-2.5 bg-blue-600 rounded-full" style={{ width: "45%" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Analyze */}
                  <div className="mx-auto max-w-6xl">
                    <div className="flex flex-col gap-12 items-center lg:flex-row">
                      <div className="space-y-6 lg:w-1/2">
                        <div className="flex gap-4 items-center">
                          <div className="flex justify-center items-center w-12 h-12 text-xl font-bold bg-yellow-300 rounded-full text-zinc-800 dark:bg-yellow-900/30">
                            3
                          </div>
                          <h3 className="text-2xl font-bold">Analyze Results</h3>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300">
                          Compare multiple implementations, share results with your team and make data-driven
                          decisions.
                        </p>
                        <ul className="space-y-3">
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Statistical analysis</span>
                          </li>
                          <li className="flex gap-3 items-center">
                            <Check className="w-5 h-5 text-green-500" />
                            <span>Shareable reports</span>
                          </li>
                        </ul>
                      </div>
                      <div className="lg:w-1/2">
                        <div className="p-6 space-y-6 bg-white rounded-lg shadow-xl backdrop-blur dark:bg-zinc-900">
                          <div>
                            <h4 className="mb-2 font-semibold">Performance Summary</h4>
                            <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                              <p>
                                • QuickSort is <span className="font-medium text-green-600">25% faster</span>{" "}
                                than MergeSort
                              </p>
                              <p>• Consistent performance across all input sizes</p>
                              <p>• 95% confidence interval: ±0.5%</p>
                            </div>
                          </div>
                          {/* <div> */}
                          {/*   <h4 className="mb-2 font-semibold">Memory Usage</h4> */}
                          {/*   <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-300"> */}
                          {/*     <p>• 15% less memory allocation</p> */}
                          {/*     <p>• No memory leaks detected</p> */}
                          {/*     <p>• Stable garbage collection pattern</p> */}
                          {/*   </div> */}
                          {/* </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </Section>

            {/* use cases */}
            {/* <Section> */}
            {/*   <section> */}
            {/*     <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" /> */}
            {/*     <div className="relative"> */}
            {/*       <div className="mx-auto mb-12 max-w-2xl text-center"> */}
            {/*         <h2 className="mb-4 text-3xl font-bold">Use Cases</h2> */}
            {/*         <p className="text-zinc-600 dark:text-zinc-300"> */}
            {/*           From individual developers to large teams, BenchJS helps everyone understand and */}
            {/*           optimize JavaScript performance. */}
            {/*         </p> */}
            {/*       </div> */}
            {/*       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> */}
            {/*         {useCases.map((useCase, index) => ( */}
            {/*           <Card */}
            {/*             // eslint-disable-next-line react/no-array-index-key */}
            {/*             key={index} */}
            {/*             className="overflow-hidden relative bg-white border-none transition-shadow hover:shadow-lg group backdrop-blur dark:bg-zinc-900" */}
            {/*           > */}
            {/*             <CardHeader className="flex flex-row gap-4 items-center"> */}
            {/*               <div className="flex justify-center items-center w-12 h-12 bg-yellow-200 rounded-lg transition-colors group-hover:bg-purple-200 dark:bg-purple-900/30 dark:group-hover:bg-purple-900/50"> */}
            {/*                 {useCase.icon} */}
            {/*               </div> */}
            {/*               <CardTitle>{useCase.title}</CardTitle> */}
            {/*             </CardHeader> */}
            {/*             <CardContent> */}
            {/*               <p className="text-zinc-600 dark:text-zinc-300">{useCase.description}</p> */}
            {/*             </CardContent> */}
            {/*             <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-20" /> */}
            {/*           </Card> */}
            {/*         ))} */}
            {/*       </div> */}
            {/*     </div> */}
            {/*   </section> */}
            {/* </Section> */}

            {/* Open Source Section */}
            {isOpenSource && (
              <Section className="bg-gradient-to-br from-yellow-200 to-orange-200 dark:from-yellow-900/50 dark:to-orange-900/50">
                <section>
                  <div className="absolute inset-0 bg-grid-black/[0.03] dark:bg-grid-white/[0.03]" />
                  <div className="relative">
                    <div className="flex flex-col gap-12 items-center lg:flex-row">
                      <div className="text-center lg:w-1/2 lg:text-left">
                        <h2 className="mb-6 text-4xl font-bold">Built by the Community</h2>
                        <p className="mb-8 text-xl text-zinc-600 dark:text-zinc-300">
                          BenchJS thrives on community contributions. From bug fixes to new features, every
                          improvement comes from developers like you.
                        </p>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <a href="https://github.com/3rd/benchjs" rel="noopener noreferrer" target="_blank">
                            <Button className="gap-2 w-full sm:w-auto" size="lg" variant="default">
                              <Github className="w-4 h-4" />
                              View Source
                            </Button>
                          </a>
                          <Link to="/docs/contributing">
                            <Button className="gap-2 w-full sm:w-auto" size="lg" variant="outline">
                              <GitBranch className="w-4 h-4" />
                              Contribute
                            </Button>
                          </Link>
                        </div>
                        <div className="grid grid-cols-2 gap-8 mt-8">
                          <div className="text-left">
                            <h3 className="flex gap-2 items-center mb-2 font-semibold">
                              <GitBranch className="w-5 h-5 text-yellow-700" />
                              MIT License
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Free and open source under the MIT License. Use it however you want.
                            </p>
                          </div>
                          <div className="text-left">
                            <h3 className="flex gap-2 items-center mb-2 font-semibold">
                              <Users className="w-5 h-5 text-yellow-700" />
                              Active Community
                            </h3>
                            <p className="text-sm text-zinc-600 dark:text-zinc-400">
                              Join our Discord for discussions, help, and collaboration.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-8 bg-white rounded-xl shadow-xl lg:w-1/2 backdrop-blur dark:bg-zinc-900">
                        <div className="space-y-6">
                          <div className="flex gap-4 items-start">
                            <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-yellow-200 rounded-full dark:bg-purple-900/30">
                              <Code className="w-4 h-4 text-yellow-700" />
                            </div>
                            <div>
                              <h3 className="mb-1 font-semibold">Contribute Code</h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Help improve the core functionality, fix bugs, or add new features.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-yellow-200 rounded-full dark:bg-purple-900/30">
                              <BookOpen className="w-4 h-4 text-yellow-700" />
                            </div>
                            <div>
                              <h3 className="mb-1 font-semibold">Improve Docs</h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Help make our documentation better, clearer, and more comprehensive.
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-4 items-start">
                            <div className="flex flex-shrink-0 justify-center items-center w-8 h-8 bg-yellow-200 rounded-full dark:bg-purple-900/30">
                              <MessageSquare className="w-4 h-4 text-yellow-700" />
                            </div>
                            <div>
                              <h3 className="mb-1 font-semibold">Join Discussions</h3>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                Share ideas, report issues, and help shape the future of BenchJS.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </Section>
            )}
          </main>

          {/* footer */}
          <footer className="py-4 w-full bg-zinc-100 dark:bg-zinc-800">
            <div className="container flex justify-between items-center px-4 mx-auto max-w-6xl">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                <a href="https://andrei.fyi" rel="noopener noreferrer" target="_blank">
                  © Andrei ❤️
                </a>
              </p>
              {isOpenSource && (
                <div className="flex space-x-4">
                  <a
                    className="text-zinc-500 dark:hover:text-zinc-300 hover:text-zinc-600"
                    href="https://github.com/3rd/benchjs"
                  >
                    <span className="sr-only">GitHub</span>
                    <Github className="w-6 h-6" />
                  </a>
                </div>
              )}
            </div>
          </footer>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
