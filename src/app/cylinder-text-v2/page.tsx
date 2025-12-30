import CylinderScroll from "@/components/CylinderScroll";

const awardsData = [
    { title: "GSAP", label: "Website of the day" },
    { title: "CSSDA", label: "Website of the day" },
    { title: "Orpetron", label: "Website of the day" },
    { title: "Awwwards", label: "Website of the day" },
    { title: "The FWA", label: "Website of the day" },
    { title: "Design Awards", label: "Website of the day" },
    { title: "Landing.Love", label: "Website of the day" },
    { title: "CSS Winner", label: "Website of the day" },
    { title: "CSSnecter", label: "Website of the day" },
    { title: "Codrops", label: "Website of the day" },
];

export default function Page() {
    return (
        <main>
            <div className="h-screen flex items-center justify-center">Scroll Down</div>

            <CylinderScroll
                items={awardsData}
                videoSrc="/lion-v3.mp4"
                radius={450}
            />

            <div className="h-screen bg-zinc-900" />
        </main>
    );
}