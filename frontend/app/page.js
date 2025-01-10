import Navbar from "@/components/Navbar";
import HomeIOT from "@/pages/homeiot";

export default function Page() {
  return (
    <div>
      <Navbar />
      <main className="mt-20">
        <HomeIOT />
      </main>
    </div>
  );
}
