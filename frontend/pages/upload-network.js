'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload } from 'lucide-react'
import Head from "next/head"
import Image from "next/image"
import UpdateFooter from "@/components/UpdateFooter"

export default function UploadForm() {
  return (
    <>
      <Head><title>SentinelAI | Upload your Network</title></Head>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br bg-[#ffffff]">
        <Card className="w-full max-w-4xl h-[600px] bg-[#f4f4f4] backdrop-blur-md border-0 shadow-2xl">
          <CardContent className="p-10 h-full flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full h-full">
              {/* Left side */}
              <div className="flex flex-col justify-center items-center text-center space-y-8">
                <div className="w-full space-y-6">
                  <p className="text-black text-lg urbanist mb-4 font-semibold">
                    Upload your network file to integrate with our solution
                  </p>
                  <label htmlFor="file-upload" className="w-full poppins">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".py"
                      className="hidden"
                      onChange={(e) => {
                        console.log(e.target.files[0]);
                      }}
                    />
                    <Button 
                      className="w-full py-6 text-lg bg-[#FB0000] hover:bg-[#FF4D4D] transition-colors duration-300" 
                      onClick={() => document.getElementById('file-upload').click()}
                    >
                      <Upload className="mr-2 h-6 w-6" /> Upload Your Network File
                    </Button>
                  </label>
                </div>
                <CardDescription className="text-lg font-semibold text-black p-5 rounded-lg font-sans">
                  Note: Please upload only .py (Python) files
                </CardDescription>
              </div>

              {/* Right side */}
              <div className="flex flex-col items-center justify-center">
                <div className="text-center space-y-6">
                  <Image
                    src="/logos/logo_black.png"
                    alt="IoT System Overview"
                    width={100}
                    height={100}
                    className="rounded-lg mx-auto"
                  />
                  <h2 className="text-6xl font-bold mb-2 text-[#FB0000] bg-clip-text space_grotesk">SentinelAI</h2>
                  <p className="text-xl text-black play">Smart Security for Smarter Devices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <UpdateFooter/>
    </>
  )
}

