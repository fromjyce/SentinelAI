import Navbar from "@/components/Navbar";
import HomeIOT from "@/pages/homeiot";

export default function Page() {
  return (
    <div>
      <Navbar />
      <main className="mt-20 p-6">
        <HomeIOT />
      </main>
    </div>
  );
}
