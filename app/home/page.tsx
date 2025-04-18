"use client"

import type React from "react"

import { useState } from "react"
import ProtectedRoute from "@/components/protected-route"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Key, Hash, RefreshCw, Share2, Download } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

type CryptoOperation =
  | "generate-password"
  | "generate-key"
  | "encrypt-symmetric"
  | "decrypt-symmetric"
  | "encrypt-asymmetric"
  | "decrypt-asymmetric"
  | "hash-file"
  | "compare-hash"
  | "share-key"

export default function HomePage() {
  const [selectedOperation, setSelectedOperation] = useState<CryptoOperation>("generate-password")
  const [file, setFile] = useState<File | null>(null)
  const [compareFile, setCompareFile] = useState<File | null>(null)
  const [keyFile, setKeyFile] = useState<File | null>(null)
  const [encryptionMethod, setEncryptionMethod] = useState("aes-256")
  const [blockMode, setBlockMode] = useState("cbc")
  const [customIv, setCustomIv] = useState("")
  const [decryptIv, setDecryptIv] = useState("")
  const [keyType, setKeyType] = useState("symmetric")
  const [generatedKey, setGeneratedKey] = useState<string | null>(null)
  const [isGeneratingKey, setIsGeneratingKey] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleCompareFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCompareFile(e.target.files[0])
    }
  }

  const handleKeyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKeyFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // This will be implemented by the user for backend integration
    console.log("Operation:", selectedOperation)
    console.log("File:", file)
    console.log("Key File:", keyFile)
    console.log("Encryption Method:", encryptionMethod)
    console.log("Block Mode:", blockMode)
    console.log("Custom IV:", customIv)
    console.log("Decrypt IV:", decryptIv)
  }

  return (
    <ProtectedRoute>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 container py-8 px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Cryptographic Operations</h1>
              <p className="text-muted-foreground">
                Secure cryptographic services for encryption, decryption, hashing, and key management
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Select Operation</CardTitle>
                <CardDescription>Choose a cryptographic operation to perform</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="operation">Operation</Label>
                      <Select
                        value={selectedOperation}
                        onValueChange={(value) => setSelectedOperation(value as CryptoOperation)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an operation" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="generate-password">Generate a Password</SelectItem>
                          <SelectItem value="generate-key">Generate a Key</SelectItem>
                          <SelectItem value="encrypt-symmetric">Encrypt a File (Symmetric)</SelectItem>
                          <SelectItem value="decrypt-symmetric">Decrypt a File (Symmetric)</SelectItem>
                          <SelectItem value="encrypt-asymmetric">Encrypt a File (Asymmetric)</SelectItem>
                          <SelectItem value="decrypt-asymmetric">Decrypt a File (Asymmetric)</SelectItem>
                          <SelectItem value="hash-file">Hash a File</SelectItem>
                          <SelectItem value="compare-hash">Compare File Hashes</SelectItem>
                          <SelectItem value="share-key">Generate & Share Keys (DH)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dynamic content based on selected operation */}
                    {selectedOperation === "generate-password" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="password-length">Password Length</Label>
                          <Input id="password-length" type="number" defaultValue={12} min={8} max={64} />
                        </div>
                        <div className="space-y-2">
                          <Label>Password Options</Label>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-uppercase" defaultChecked />
                              <label htmlFor="include-uppercase" className="text-sm">
                                Include Uppercase
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-lowercase" defaultChecked />
                              <label htmlFor="include-lowercase" className="text-sm">
                                Include Lowercase
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-numbers" defaultChecked />
                              <label htmlFor="include-numbers" className="text-sm">
                                Include Numbers
                              </label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="include-symbols" defaultChecked />
                              <label htmlFor="include-symbols" className="text-sm">
                                Include Symbols
                              </label>
                            </div>
                          </div>
                        </div>
                        <Button type="submit" className="w-full">
                          <Key className="mr-2 h-4 w-4" />
                          Generate Password
                        </Button>
                        {/* Result section - would be conditionally shown after generation */}
                        <div className="border rounded-md p-4 space-y-4">
                          <div className="space-y-2">
                            <Label>Generated Password</Label>
                            <div className="bg-muted p-2 rounded font-mono text-sm">P@ssw0rd!2345Abc</div>
                          </div>
                          <Button className="w-full" variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Copy to Clipboard
                          </Button>
                        </div>
                      </div>
                    )}

                    {selectedOperation === "generate-key" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Key Type</Label>
                          <RadioGroup value={keyType} onValueChange={setKeyType}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="symmetric" id="symmetric" />
                              <Label htmlFor="symmetric">Symmetric Key</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="asymmetric" id="asymmetric" />
                              <Label htmlFor="asymmetric">Asymmetric Key Pair</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {keyType === "symmetric" ? (
                          <div className="space-y-2">
                            <Label>Key Algorithm</Label>
                            <Select defaultValue="aes-256">
                              <SelectTrigger>
                                <SelectValue placeholder="Select algorithm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aes-128">AES-128</SelectItem>
                                <SelectItem value="aes-192">AES-256</SelectItem>
                                <SelectItem value="aes-256">RSA-2048</SelectItem>
                                <SelectItem value="3des">3DES</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Key Algorithm</Label>
                            <Select defaultValue="rsa-2048">
                              <SelectTrigger>
                                <SelectValue placeholder="Select algorithm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                                <SelectItem value="rsa-4096">RSA-4096</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="key-name">Key Name (for file download)</Label>
                          <Input id="key-name" placeholder="my_key" />
                        </div>

                        <div className="space-y-4">
                          <Button type="submit" className="w-full">
                            <Key className="mr-2 h-4 w-4" />
                            Generate Key
                          </Button>

                          {/* Result section - would be conditionally shown after generation */}
                          <div className="border rounded-md p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Generated Key</Label>
                              <div className="bg-muted p-2 rounded font-mono text-xs break-all">
                                f8a2e9c1d7b6a5f4e3d2c1b0a9f8e7d6
                              </div>
                            </div>
                            <Button className="w-full" variant="outline">
                              <Download className="mr-2 h-4 w-4" />
                              Download Key
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOperation === "encrypt-symmetric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="file-upload">Select File to Encrypt</Label>
                          <div className="flex items-center gap-2">
                            <Input id="file-upload" type="file" onChange={handleFileChange} className="flex-1" />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Encryption Algorithm</Label>
                          <Select value={encryptionMethod} onValueChange={setEncryptionMethod}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aes-128">AES-128</SelectItem>
                              <SelectItem value="aes-256">AES-256</SelectItem>
                              <SelectItem value="3des">3DES</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Block Mode</Label>
                          <Select value={blockMode} onValueChange={setBlockMode}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select block mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbc">CBC</SelectItem>
                              <SelectItem value="ecb">ECB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* IV Input - only show for CBC mode */}
                        {blockMode === "cbc" && (
                          <div className="space-y-2">
                            <Label htmlFor="custom-iv">Initialization Vector (IV) - Hex Format</Label>
                            <Input
                              id="custom-iv"
                              placeholder="e.g., 0123456789abcdef0123456789abcdef"
                              value={customIv}
                              onChange={(e) => setCustomIv(e.target.value)}
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              For AES, enter 32 hex characters (16 bytes). For 3DES, enter 16 hex characters (8 bytes).
                            </p>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label>Encryption Key</Label>
                          <Tabs defaultValue="input">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="input">Enter Key</TabsTrigger>
                              <TabsTrigger value="upload">Upload Key File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="input" className="space-y-2">
                              <Input
                                id="encryption-key"
                                type="password"
                                placeholder="Enter encryption key (hex format)"
                              />
                              <p className="text-xs text-muted-foreground">
                                Leave blank to auto-generate a key (will be available for download)
                              </p>
                            </TabsContent>
                            <TabsContent value="upload" className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  id="key-file-upload"
                                  type="file"
                                  onChange={handleKeyFileChange}
                                  className="flex-1"
                                />
                                {keyFile && (
                                  <Button variant="outline" size="sm" onClick={() => setKeyFile(null)}>
                                    Clear
                                  </Button>
                                )}
                              </div>
                              {keyFile && <p className="text-sm text-muted-foreground">Selected: {keyFile.name}</p>}
                            </TabsContent>
                          </Tabs>
                        </div>

                        <Button type="submit" className="w-full">
                          <Lock className="mr-2 h-4 w-4" />
                          Encrypt File
                        </Button>

                        <div className="space-y-2 border rounded-md p-4 mt-4">
                          <Label>Result</Label>
                          <p className="text-sm text-muted-foreground mb-2">
                            After encryption, you'll be able to download:
                          </p>
                          <div className="flex flex-col gap-2">
                            <Button variant="outline" disabled>
                              <Download className="mr-2 h-4 w-4" />
                              Download Encrypted File
                            </Button>
                            <Button variant="outline" disabled>
                              <Download className="mr-2 h-4 w-4" />
                              Download Encryption Key
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedOperation === "decrypt-symmetric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="decrypt-file-upload">Select Encrypted File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="decrypt-file-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Decryption Key</Label>
                          <Tabs defaultValue="input">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="input">Enter Key</TabsTrigger>
                              <TabsTrigger value="upload">Upload Key File</TabsTrigger>
                            </TabsList>
                            <TabsContent value="input" className="space-y-2">
                              <Input
                                id="decryption-key"
                                type="password"
                                placeholder="Enter decryption key (hex format)"
                              />
                            </TabsContent>
                            <TabsContent value="upload" className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  id="decrypt-key-file-upload"
                                  type="file"
                                  onChange={handleKeyFileChange}
                                  className="flex-1"
                                />
                                {keyFile && (
                                  <Button variant="outline" size="sm" onClick={() => setKeyFile(null)}>
                                    Clear
                                  </Button>
                                )}
                              </div>
                              {keyFile && <p className="text-sm text-muted-foreground">Selected: {keyFile.name}</p>}
                            </TabsContent>
                          </Tabs>
                        </div>

                        <div className="space-y-2">
                          <Label>Encryption Algorithm (must match what was used for encryption)</Label>
                          <Select defaultValue="aes-256">
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aes-128">AES-128</SelectItem>
                              <SelectItem value="aes-192">AES-192</SelectItem>
                              <SelectItem value="aes-256">AES-256</SelectItem>
                              <SelectItem value="3des">3DES</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Block Mode (must match what was used for encryption)</Label>
                          <Select defaultValue="cbc">
                            <SelectTrigger>
                              <SelectValue placeholder="Select block mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbc">CBC</SelectItem>
                              <SelectItem value="ecb">ECB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* IV Input for decryption - only show for CBC mode */}
                        {blockMode === "cbc" && (
                          <div className="space-y-2">
                            <Label htmlFor="decrypt-iv">Initialization Vector (IV) - Hex Format</Label>
                            <Input
                              id="decrypt-iv"
                              placeholder="e.g., 0123456789abcdef0123456789abcdef"
                              value={decryptIv}
                              onChange={(e) => setDecryptIv(e.target.value)}
                              required
                            />
                            <p className="text-xs text-muted-foreground">
                              Enter the same IV that was used for encryption.
                            </p>
                          </div>
                        )}

                        <Button type="submit" className="w-full">
                          <Lock className="mr-2 h-4 w-4" />
                          Decrypt File
                        </Button>

                        <div className="text-sm text-muted-foreground">
                          The decrypted file will be available for download after decryption.
                        </div>
                      </div>
                    )}

                    {selectedOperation === "encrypt-asymmetric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="asymmetric-file-upload">Select File to Encrypt</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="asymmetric-file-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label>Encryption Algorithm</Label>
                          <Select defaultValue="rsa-2048">
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                              
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="public-key-upload">Upload Public Key File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="public-key-upload"
                              type="file"
                              onChange={handleKeyFileChange}
                              className="flex-1"
                            />
                            {keyFile && (
                              <Button variant="outline" size="sm" onClick={() => setKeyFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {keyFile && <p className="text-sm text-muted-foreground">Selected: {keyFile.name}</p>}
                        </div>

                        <Button type="submit" className="w-full">
                          <Lock className="mr-2 h-4 w-4" />
                          Encrypt File
                        </Button>

                        <div className="text-sm text-muted-foreground">
                          The encrypted file will be available for download after encryption.
                        </div>
                      </div>
                    )}

                    {selectedOperation === "decrypt-asymmetric" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="asymmetric-decrypt-file-upload">Select Encrypted File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="asymmetric-decrypt-file-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="private-key-upload">Upload Private Key File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="private-key-upload"
                              type="file"
                              onChange={handleKeyFileChange}
                              className="flex-1"
                            />
                            {keyFile && (
                              <Button variant="outline" size="sm" onClick={() => setKeyFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {keyFile && <p className="text-sm text-muted-foreground">Selected: {keyFile.name}</p>}
                        </div>

                        

                        <div className="space-y-2">
                          <Label>Encryption Algorithm (must match what was used for encryption)</Label>
                          <Select defaultValue="rsa-2048">
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                              
                            </SelectContent>
                          </Select>
                        </div>

                        <Button type="submit" className="w-full">
                          <Lock className="mr-2 h-4 w-4" />
                          Decrypt File
                        </Button>

                        <div className="text-sm text-muted-foreground">
                          The decrypted file will be available for download after decryption.
                        </div>
                      </div>
                    )}

                    {selectedOperation === "hash-file" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="hash-file-upload">Select File to Hash</Label>
                          <div className="flex items-center gap-2">
                            <Input id="hash-file-upload" type="file" onChange={handleFileChange} className="flex-1" />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Hash Algorithm</Label>
                          <Select defaultValue="sha256">
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                            
                              <SelectItem value="sha256">SHA-256 (SHA-2)</SelectItem>
                        
                              <SelectItem value="sha512">SHA-512 (SHA-2)</SelectItem>
                          
                              <SelectItem value="sha3-256">SHA3-256 (SHA-3)</SelectItem>
                        
                              <SelectItem value="sha3-512">SHA3-512 (SHA-3)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">
                          <Hash className="mr-2 h-4 w-4" />
                          Generate Hash
                        </Button>

                        <div className="text-sm text-muted-foreground">
                          The hash result will be displayed and available for download as a text file.
                        </div>
                      </div>
                    )}

                    {selectedOperation === "compare-hash" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="compare-file1-upload">Select First File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="compare-file1-upload"
                              type="file"
                              onChange={handleFileChange}
                              className="flex-1"
                            />
                            {file && (
                              <Button variant="outline" size="sm" onClick={() => setFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="compare-file2-upload">Select Second File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="compare-file2-upload"
                              type="file"
                              onChange={handleCompareFileChange}
                              className="flex-1"
                            />
                            {compareFile && (
                              <Button variant="outline" size="sm" onClick={() => setCompareFile(null)}>
                                Clear
                              </Button>
                            )}
                          </div>
                          {compareFile && <p className="text-sm text-muted-foreground">Selected: {compareFile.name}</p>}
                        </div>
                        <div className="space-y-2">
                          <Label>Hash Algorithm</Label>
                          <Select defaultValue="sha256">
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sha256">SHA-256 (SHA-2)</SelectItem>
                              <SelectItem value="sha512">SHA-512 (SHA-2)</SelectItem>
                              <SelectItem value="sha3-256">SHA3-256 (SHA-3)</SelectItem>
                              <SelectItem value="sha3-512">SHA3-512 (SHA-3)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Alternative: Compare with Hash Value</Label>
                          <Tabs defaultValue="files">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="files">Compare Files</TabsTrigger>
                              
                            </TabsList>
                            <TabsContent value="files">
                              <p className="text-sm text-muted-foreground">Both files will be hashed and compared.</p>
                            </TabsContent>
                            
                          </Tabs>
                        </div>
                        <Button type="submit" className="w-full">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Compare Hashes
                        </Button>
                      </div>
                    )}

                    {selectedOperation === "share-key" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Key Exchange Method</Label>
                          <Select defaultValue="dh">
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dh">Diffie-Hellman</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Parameters Size</Label>
                          <Select defaultValue="2048">
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1024">1024 bits</SelectItem>
                              <SelectItem value="2048">2048 bits</SelectItem>
                              <SelectItem value="3072">3072 bits</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="key-name-dh">Key Name (for file download)</Label>
                          <Input id="key-name-dh" placeholder="shared_key" />
                        </div>
                        <div className="space-y-2">
                          <Label>Exchange Mode</Label>
                          <RadioGroup defaultValue="generate">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="generate" id="generate-params" />
                              <Label htmlFor="generate-params">Generate New Parameters</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="receive" id="receive-params" />
                              <Label htmlFor="receive-params">Receive Parameters</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label>Received Public Value (if receiving)</Label>
                          <Textarea placeholder="Paste the public value received from the other party" />
                        </div>
                        <Button type="submit" className="w-full">
                          <Share2 className="mr-2 h-4 w-4" />
                          Generate Key Exchange
                        </Button>

                        <div className="text-sm text-muted-foreground">
                          The generated public value and shared key will be available for download.
                        </div>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
