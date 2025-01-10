'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from 'lucide-react'
import Head from "next/head"

export default function UploadForm() {
  return (
    <>
    <Head><title>SentinelAI | Upload your Network</title></Head>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-4xl h-[600px]">
        <CardContent className="p-6 h-full flex items-center justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Left side */}
            <div className="flex flex-col justify-between items-center text-center">
              <div>
                <CardTitle className="text-2xl font-bold mb-4">Upload Your File</CardTitle>
                <Button className="w-full mb-4">
                  <Upload className="mr-2 h-4 w-4" /> Choose File
                </Button>
              </div>
              <CardDescription className="text-sm text-muted-foreground">
                Note: Please upload only .mn files
              </CardDescription>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-center">
                <Upload className="mx-auto h-16 w-16 text-primary mb-4" />
                <h2 className="text-2xl font-bold mb-2">Brand Name</h2>
                <p className="text-muted-foreground">Your catchy tagline goes here</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </>
  )
}

