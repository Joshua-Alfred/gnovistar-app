"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { doc, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Material = {
  name: string;
  link: string;
};

export default function BookDetailsPage() {
  const { bookName: rawBookName } = useParams();
  const bookName = decodeURIComponent(rawBookName as string);
  const { userId } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      if (!userId || !bookName) return;
      try {
        const bookCollectionRef = collection(doc(db, "users", userId), bookName as string);
        const materialsSnap = await getDocs(bookCollectionRef);
        const fetched: Material[] = [];

        materialsSnap.forEach((doc) => {
          const data = doc.data();
          if (data.name && data.link && doc.id !== "init") {
            fetched.push({
              name: data.name,
              link: data.link,
            });
          }
        });

        setMaterials(fetched);
      } catch (error) {
        console.error("Failed to fetch materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [userId, bookName]);

  if (loading) {
    return <div className="p-10 text-center text-lg">Loading book content...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/dashboard" className="text-blue-500 hover:underline flex items-center">
          <ArrowLeft className="mr-2" />  
        </Link>
        <h1 className="text-3xl font-bold">{bookName}</h1>
      </div>

      {materials.length === 0 ? (
        <p className="text-neutral-500">No materials found for this book.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {materials.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{item.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Resource
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
