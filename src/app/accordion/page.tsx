'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';

const techStack = [
  {
    title: 'Frontend',
    items: [
      {
        title: 'Frameworks & Libraries',
        technologies: ['ReactJS', 'JavaScript (ES6+)', 'jQuery', 'GSAP'],
      },
      {
        title: 'Styling & UI',
        technologies: ['Bootstrap', 'Tailwind CSS', 'Sass / SCSS', 'LESS'],
      },
      {
        title: 'Web & Animation',
        technologies: [
          'Animated Websites',
          'Interactive UI / Motion Design',
          'Responsive & Performance-Optimized Frontends',
        ],
      },
    ],
  },
  {
    title: 'Backend',
    items: [
      { title: 'Languages & Runtime', technologies: ['PHP', 'Node.js'] },
      { title: 'Frameworks', technologies: ['Express.js'] },
      { title: 'Platforms & Systems', technologies: ['Magento', 'WordPress'] },
      {
        title: 'APIs & Integrations',
        technologies: ['REST APIs', 'Headless Architecture Support'],
      },
    ],
  },
  {
    title: 'Databases & Content Management',
    items: [
      { title: 'Databases', technologies: ['MySQL', 'MongoDB'] },
      { title: 'Headless CMS', technologies: ['Contentful', 'WordPress CMS', 'Headless CMS'] },
    ],
  },
  {
    title: 'Cloud Services',
    items: [
      {
        title: 'Cloud Platforms',
        technologies: ['Amazon Web Services (AWS)', 'Google Cloud Platform (GCP)', 'DigitalOcean'],
      },
      {
        title: 'Cloud Capabilities',
        technologies: ['Scalable Cloud Hosting', 'Managed Databases', 'Cloud-Based Deployments'],
      },
    ],
  },
  {
    title: 'DevOps & Infrastructure',
    items: [
      { title: 'Version Control', technologies: ['Git', 'GitHub'] },
      { title: 'CI / CD', technologies: ['GitHub Actions'] },
      { title: 'Automation & Workflows', technologies: ['n8n (Workflow Automation)'] },
    ],
  },
  {
    title: 'AI & Intelligent Automation',
    items: [
      {
        title: 'AI Platforms & APIs',
        technologies: ['OpenAI (ChatGPT, Whisper)', 'OpenAI SDK (Node.js / PHP Integration)'],
      },
      {
        title: 'AI Capabilities',
        technologies: [
          'AI-powered Chatbots & Assistants',
          'Content Generation (Text, Code, Visuals)',
          'AI-driven Search & Recommendation Systems',
          'AI Workflow Automation Solutions',
          'AI Integration for Websites & Web Apps',
        ],
      },
    ],
  },
  {
    title: 'Marketing, Email & Integrations',
    items: [
      {
        title: 'Email & Communication',
        technologies: ['HubSpot', 'HubSpot Email Templates', 'SendGrid Email Templates'],
      },
      {
        title: 'Marketing Automation',
        technologies: ['CRM & Workflow Automation', 'API-driven Marketing Integrations'],
      },
    ],
  },
];

const Page = () => {
  const contentRefs = useRef<HTMLDivElement[]>([]);
  const iconRefs = useRef<HTMLSpanElement[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    contentRefs.current.forEach((el, i) => {
      if (!el) return;

      const isOpen = activeIndex === i;

      gsap.to(el, {
        height: i === index && !isOpen ? 'auto' : 0,
        opacity: i === index && !isOpen ? 1 : 0,
        duration: 0.7,
        ease: 'power3.inOut',
      });

      gsap.to(iconRefs.current[i], {
        rotate: i === index && !isOpen ? 180 : 0,
        duration: 0.5,
        ease: 'power3.inOut',
      });
    });

    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <main className="max-w-7xl mx-auto px-10">
      <section className="mt-[50vh]">
        {techStack.map((section, index) => (
          <div key={index} className="border-b border-neutral-300">
            {/* Header */}
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full flex items-center justify-between py-12 text-left"
            >
              <div className="flex items-center gap-10">
                <span className="text-xl opacity-50">{index + 1}.</span>
                <h2 className="text-4xl font-medium">{section.title}</h2>
              </div>

              <span
                ref={(el) => {
                  if (el) iconRefs.current[index] = el;
                }}
                className="text-3xl leading-none inline-block"
              >
                <svg
                  fill="#000000"
                  width="20px"
                  height="20px"
                  viewBox="0 0 24 24"
                  id="up"
                  data-name="Flat Color"
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon flat-color"
                >
                  <path
                    id="primary"
                    d="M19.71,9.29l-7-7a1,1,0,0,0-1.42,0l-7,7a1,1,0,0,0,1.42,1.42L11,5.41V21a1,1,0,0,0,2,0V5.41l5.29,5.3a1,1,0,0,0,1.42,0A1,1,0,0,0,19.71,9.29Z"
                    style={{
                      fill: 'rgb(0, 0, 0)',
                    }}
                  />
                </svg>
              </span>
            </button>

            {/* Content */}
            <div
              ref={(el) => {
                if (el) contentRefs.current[index] = el;
              }}
              className="h-0 overflow-hidden opacity-0"
            >
              <div className="grid grid-cols-2 gap-x-20 gap-y-12 pb-14 pl-20">
                {section.items.map((block, i) => (
                  <div key={i}>
                    <h4 className="mb-4 text-sm uppercase tracking-wide opacity-60">
                      {block.title}
                    </h4>
                    <ul className="space-y-2">
                      {block.technologies.map((tech, j) => (
                        <li key={j} className="text-base">
                          {tech}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Page;
