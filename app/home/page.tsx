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
  const [passwordLength, setPasswordLength] = useState(12);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [encryptionResult, setEncryptionResult] = useState<string | null>(null);
  const [keyName, setKeyName] = useState("my_key");
  const [symmetricAlgorithm, setSymmetricAlgorithm] = useState("aes-256");
  const [asymmetricAlgorithm, setAsymmetricAlgorithm] = useState("rsa-2048");
  const [decryptionResult, setDecryptionResult] = useState<string | null>(null);
  const [asymmetricKeyFile, setAsymmetricKeyFile] = useState<File | null>(null);
  const [decryptionAsymmetricResult, setDecryptionAsymmetricResult] = useState<string | null>(null);
  const [encryptionAsymmetricResult, setEncryptionAsymmetricResult] = useState<string | null>(null);
  const [selectedHashAlgorithm, setSelectedHashAlgorithm] = useState<string | null>(null);
  
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Define API URL 
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    try {
      setIsLoading(true);
      setError(null);
      
      if (selectedOperation === "generate-password") {
        // Validation
        if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
          throw new Error("At least one character type must be selected");
        }
        
        if (passwordLength < 8 || passwordLength > 128) {
          throw new Error("Password length must be between 8 and 128 characters");
        }
        
        // Create payload using state variables
        const payload = {
          length: passwordLength,
          use_uppercase: useUppercase,
          use_lowercase: useLowercase,
          use_numbers: useNumbers,
          use_symbols: useSymbols
        };
        
        console.log("Generating password with parameters:", payload);
        
        // Make the actual API call
        const response = await fetch(`${API_URL}/generate/password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || `Password generation failed: ${response.statusText}`);
        }
        
        const data = await response.json();
        setGeneratedPassword(data.password);
      }
      
      if (selectedOperation === "generate-key") {
        // Validation
        if (!keyName.trim()) {
          throw new Error("Key name is required");
        }
        
        // Get the current algorithm based on key type
        const algorithm = keyType === "symmetric" ? symmetricAlgorithm : asymmetricAlgorithm;
        
        // Format algorithm for API (convert from kebab-case to uppercase with dash)
        const formattedAlgorithm = algorithm.split('-')
          .map(part => part.toUpperCase())
          .join('-');
        
        // Get the key name with a fallback
        const finalKeyName = keyName.trim() || "my_key";
        
        const payload = {
          key_type: keyType,
          algorithm: formattedAlgorithm,
          key_name: finalKeyName
        };
        
        console.log("Generating key with parameters:", payload);
        
        // Make the actual API call
        const response = await fetch(`${API_URL}/generate/key`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.detail || `Key generation failed: ${response.statusText}`);
        }
        
        // Handle file download from the response
        const blob = await response.blob();
        
        // Get filename from content-disposition header if available
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `${keyName}.key`;
        
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        // Check if there's a public key available (for asymmetric keys)
        const hasPublicKey = response.headers.get('X-Public-Key-Available') === 'true';
        const publicKeyName = response.headers.get('X-Public-Key-Name');
        
        // Debug: Log headers to see if we're receiving them properly
        console.log("Response headers:", {
          contentDisposition,
          hasPublicKey,
          publicKeyName,
          "X-Public-Key-Available": response.headers.get('X-Public-Key-Available'),
          "X-Public-Key-Name": response.headers.get('X-Public-Key-Name'),
        });
        
        // Download the primary key (private key for asymmetric, or symmetric key)
        const downloadUrl = window.URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(downloadUrl);
        
        // If there's a public key available, download it too
        if (hasPublicKey && publicKeyName) {
          console.log("Public key available, attempting to download...", publicKeyName);
          try {
            // Fetch the public key
            const publicKeyUrl = `${API_URL}/generate/key/public/${publicKeyName}`;
            console.log("Fetching public key from:", publicKeyUrl);
            
            const publicKeyResponse = await fetch(publicKeyUrl);
            console.log("Public key response status:", publicKeyResponse.status);
            
            if (publicKeyResponse.ok) {
              console.log("Public key fetch successful, downloading...");
              const publicKeyBlob = await publicKeyResponse.blob();
              
              // Get filename for public key
              const publicKeyContentDisposition = publicKeyResponse.headers.get('content-disposition');
              let publicKeyFilename = `${publicKeyName}_public.pem`;
              
              if (publicKeyContentDisposition && publicKeyContentDisposition.includes('filename=')) {
                const publicKeyFilenameMatch = publicKeyContentDisposition.match(/filename="(.+)"/);
                if (publicKeyFilenameMatch && publicKeyFilenameMatch[1]) {
                  publicKeyFilename = publicKeyFilenameMatch[1];
                }
              }
              
              // Download the public key
              const publicKeyDownloadUrl = window.URL.createObjectURL(publicKeyBlob);
              const publicKeyDownloadLink = document.createElement('a');
              publicKeyDownloadLink.href = publicKeyDownloadUrl;
              publicKeyDownloadLink.download = publicKeyFilename;
              document.body.appendChild(publicKeyDownloadLink);
              publicKeyDownloadLink.click();
              document.body.removeChild(publicKeyDownloadLink);
              window.URL.revokeObjectURL(publicKeyDownloadUrl);
              console.log("Public key downloaded successfully:", publicKeyFilename);
            } else {
              console.error("Failed to fetch public key:", publicKeyResponse.status, publicKeyResponse.statusText);
            }
          } catch (publicKeyError) {
            console.error("Error during public key download:", publicKeyError);
            // We still continue since we already have the private key
          }
        }
        
        // Success message based on key type
        if (keyType === "asymmetric") {
          setResult(`Success! Downloaded both your private and public keys.
            • Keep your private key (${filename}) secure and never share it.
            • Share your public key with others who need to send you encrypted files.`);
        } else {
          setResult(`Success! Generated and downloaded ${algorithm} key.
            Keep this key secure - you'll need it for decryption.`);
        }
      }
      
      if (selectedOperation === "encrypt-symmetric") {
        // Validation
        if (!file) {
          throw new Error("Please select a file to encrypt");
        }
        
        // Format algorithm and mode for the backend (convert to uppercase)
        const algorithm = encryptionMethod
          .split('-')
          .map(part => part.toUpperCase())
          .join('-');
        
        const mode = blockMode.toUpperCase();
        
        // Create FormData to send files and parameters
        const formData = new FormData();
        formData.append("algorithm", algorithm);
        formData.append("mode", mode);
        formData.append("file", file);
        
        // Add key file if provided
        if (keyFile) {
          formData.append("key_file", keyFile);
        }
        
        // Add custom IV if provided and required (CBC mode)
        if (blockMode === "cbc" && customIv.trim()) {
          formData.append("iv", customIv.trim());
        }
        
        console.log("Encrypting file with parameters:", {
          file: file.name,
          algorithm,
          mode,
          hasKeyFile: !!keyFile,
          hasCustomIv: blockMode === "cbc" && !!customIv.trim()
        });
        
        // Make the actual API call
        const response = await fetch(`${API_URL}/encrypt/symmetric`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          // Try to get detailed error if available
          let errorMessage = `Encryption failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the default message
          }
          throw new Error(errorMessage);
        }
        
        // Handle the encrypted file download
        const blob = await response.blob();
        // Try to get filename from content-disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `encrypted_${file.name}`;
        
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        // Check if the API returned auto-generated key/IV in headers
        const autoGenKey = response.headers.get('x-generated-key');
        const autoGenIv = response.headers.get('x-generated-iv');
        
        if (autoGenKey || autoGenIv) {
          let message = "File encrypted successfully. ";
          if (autoGenKey) {
            message += "An encryption key was automatically generated. Make sure to save it for decryption.";
            // You could also display the key or offer to download it
          }
          if (autoGenIv) {
            message += "An initialization vector (IV) was automatically generated. Make sure to save it for decryption.";
            // You could also display the IV or offer to download it
          }
          setEncryptionResult(message); // You'll need to add this state variable
        } else {
          setEncryptionResult("File encrypted successfully and downloaded."); // You'll need to add this state variable
        }
      }

      if (selectedOperation === "decrypt-symmetric") {
        // Validation
        if (!file) {
          throw new Error("Please select an encrypted file to decrypt");
        }
        
        // Format algorithm and mode for the backend (convert to uppercase)
        const algorithm = encryptionMethod
          .split('-')
          .map(part => part.toUpperCase())
          .join('-');
        
        const mode = blockMode.toUpperCase();
        
        // Create FormData to send files and parameters
        const formData = new FormData();
        formData.append("algorithm", algorithm);
        formData.append("mode", mode);
        formData.append("file", file);
        
        // Add key file if provided
        if (keyFile) {
          formData.append("key_file", keyFile);
        }
        
        // Add IV if provided and required (CBC mode)
        if (blockMode === "cbc" && decryptIv.trim()) {
          formData.append("iv", decryptIv.trim());
        } else if (blockMode === "cbc") {
          throw new Error("IV is required for CBC mode decryption");
        }
        
        console.log("Decrypting file with parameters:", {
          file: file.name,
          algorithm,
          mode,
          hasKeyFile: !!keyFile,
          hasIv: blockMode === "cbc" && !!decryptIv.trim()
        });
        
        // Make the API call
        const response = await fetch(`${API_URL}/decrypt/symmetric`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          // Try to get detailed error if available
          let errorMessage = `Decryption failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the default message
          }
          throw new Error(errorMessage);
        }
        
        // Handle the decrypted file download
        const blob = await response.blob();
        
        // Try to get filename from content-disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `decrypted_${file.name}`;
        
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setDecryptionResult("File decrypted successfully and downloaded.");
      }

      if (selectedOperation === "encrypt-asymmetric") {
        // Validation
        if (!file) {
          throw new Error("Please select a file to encrypt");
        }
        
        if (!keyFile) {
          throw new Error("Please upload a public key file for encryption");
        }
        
        // Create FormData to send files and parameters
        const formData = new FormData();
        formData.append("algorithm", "RSA-2048"); // Assuming RSA-2048 is the algorithm
        formData.append("file", file);
        formData.append("publicKeyFile", keyFile);
        
        console.log("Encrypting file with asymmetric encryption:", {
          file: file.name,
          publicKeyFile: keyFile.name
        });
        
        // Make the API call
        const response = await fetch(`${API_URL}/encrypt/asymmetric`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          // Try to get detailed error if available
          let errorMessage = `Asymmetric encryption failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the default message
          }
          throw new Error(errorMessage);
        }
        
        // Handle the encrypted file download
        const blob = await response.blob();
        
        // Try to get filename from content-disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `encrypted_${file.name}`;
        
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setEncryptionAsymmetricResult("File encrypted successfully and downloaded.");
      }

      if (selectedOperation === "decrypt-asymmetric") {
        // Validation
        if (!file) {
          throw new Error("Please select an encrypted file to decrypt");
        }
        
        if (!keyFile) {
          throw new Error("Please upload a private key file for decryption");
        }
        
        // Create FormData to send files and parameters
        const formData = new FormData();
        formData.append("algorithm", "RSA-2048"); // Assuming RSA-2048 is the algorithm
        formData.append("file", file);
        formData.append("privateKeyFile", keyFile);
        
        console.log("Decrypting file with asymmetric encryption:", {
          file: file.name,
          privateKeyFile: keyFile.name
        });
        
        // Make the API call
        const response = await fetch(`${API_URL}/decrypt/asymmetric`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          // Try to get detailed error if available
          let errorMessage = `Asymmetric decryption failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the default message
          }
          throw new Error(errorMessage);
        }
        
        // Handle the decrypted file download
        const blob = await response.blob();
        
        // Try to get filename from content-disposition header
        const contentDisposition = response.headers.get('content-disposition');
        let filename = `decrypted_${file.name}`;
        
        if (contentDisposition && contentDisposition.includes('filename=')) {
          const filenameMatch = contentDisposition.match(/filename="(.+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }
        
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        setDecryptionAsymmetricResult("File decrypted successfully and downloaded.");
      }

      if (selectedOperation === "hash-file") {
        // Check if a file is selected
        if (!file) {
          throw new Error("Please select a file to hash");
        }
        
        // Use the already formatted algorithm value that matches what the backend expects
        const algorithm = selectedHashAlgorithm || "SHA2-256";
        
        // Create FormData to send file and algorithm
        const formData = new FormData();
        formData.append("algorithm", algorithm);
        formData.append("file", file);
        
        console.log("Hashing file:", {
          file: file.name,
          algorithm: algorithm
        });
        
        // Make the API call
        const response = await fetch(`${API_URL}/hash`, {
          method: "POST",
          body: formData,
        });
        
        if (!response.ok) {
          // Try to get detailed error if available
          let errorMessage = `File hashing failed: ${response.statusText}`;
          try {
            const errorData = await response.json();
            if (errorData.detail) {
              errorMessage = errorData.detail;
            }
          } catch (e) {
            // If we can't parse the error as JSON, use the default message
          }
          throw new Error(errorMessage);
        }
        
        // Get the hash result as text instead of JSON
        const hashValue = await response.text();
        setResult(`File hash (${algorithm}): ${hashValue}`);
        
        // Create a downloadable file with the hash
        const blob = new Blob([hashValue], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.split('.')[0]}_hash.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }

      if (selectedOperation === "compare-hash") {
        // Validation
        if (!file || !compareFile) {
          throw new Error("Please select two hash files to compare");
        }
        
        // Ensure files have .txt extension
        if (!file.name.endsWith('.txt') || !compareFile.name.endsWith('.txt')) {
          throw new Error("Please upload .txt files containing hash values");
        }
        
        console.log("Comparing hash files:", {
          file1: file.name,
          file2: compareFile.name
        });
        
        setIsLoading(true);
        setResult(null); // Reset result before starting new comparison
        
        // Read the first hash file
        const reader1 = new FileReader();
        reader1.onload = (e1) => {
          console.log("First file read complete");
          // After first file is read, read the second file
          const hash1 = e1.target?.result?.toString().trim();
          
          const reader2 = new FileReader();
          reader2.onload = (e2) => {
            console.log("Second file read complete");
            const hash2 = e2.target?.result?.toString().trim();
            
            // Compare hashes directly
            const match = hash1 === hash2;
            console.log("Hash comparison result:", { match, hash1, hash2 });
            
            // Display result with hash values
            const resultText = match 
              ? `✅ The files have matching hashes:\n${hash1}` 
              : `❌ The files have different hashes:\nFile 1: ${hash1}\nFile 2: ${hash2}`;
            
            // Update state to display result and end loading
            setResult(resultText);
            setIsLoading(false);
            console.log("Result state updated");
          };
          
          reader2.onerror = (error) => {
            console.error("Error reading second file:", error);
            setError("Error reading the second hash file");
            setIsLoading(false);
          };
          
          reader2.readAsText(compareFile);
        };
        
        reader1.onerror = (error) => {
          console.error("Error reading first file:", error);
          setError("Error reading the first hash file");
          setIsLoading(false);
        };
        
        reader1.readAsText(file);
        
        // Return early as we're handling the async operation in the FileReader callbacks
        return;
      }

      if (selectedOperation === "share-key") {
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
                          <div className="flex items-center space-x-2">
                            <Input
                              id="password-length"
                              name="password-length"
                              type="number"
                              min={8}
                              max={128}
                              value={passwordLength}
                              onChange={(e) => setPasswordLength(parseInt(e.target.value) || 12)}
                            />
                            <span className="text-sm text-muted-foreground">characters</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Character Types</Label>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="uppercase"
                                name="uppercase"
                                checked={useUppercase} 
                                onCheckedChange={(checked) => setUseUppercase(checked === true)}
                              />
                              <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="lowercase"
                                name="lowercase"
                                checked={useLowercase} 
                                onCheckedChange={(checked) => setUseLowercase(checked === true)}
                              />
                              <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="numbers"
                                name="numbers"
                                checked={useNumbers} 
                                onCheckedChange={(checked) => setUseNumbers(checked === true)}
                              />
                              <Label htmlFor="numbers">Numbers (0-9)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id="symbols"
                                name="symbols"
                                checked={useSymbols} 
                                onCheckedChange={(checked) => setUseSymbols(checked === true)}
                              />
                              <Label htmlFor="symbols">Symbols (!@#$%&*)</Label>
                            </div>
                          </div>
                        </div>

                        <Button type="submit" className="w-full">
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Generate Password
                        </Button>

                        {/* Result section - would be conditionally shown after generation */}
                        {generatedPassword && (
                          <div className="border rounded-md p-4 space-y-4">
                            <div className="space-y-2">
                              <Label>Generated Password</Label>
                              <div className="bg-muted p-2 rounded font-mono text-sm break-all">
                                {generatedPassword}
                              </div>
                            </div>
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => {
                                navigator.clipboard.writeText(generatedPassword);
                                // Optionally add a "copied" notification
                              }}
                            >
                              Copy to Clipboard
                            </Button>
                          </div>
                        )}
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
                            <Select value={symmetricAlgorithm} onValueChange={setSymmetricAlgorithm}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select algorithm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="aes-128">AES-128</SelectItem>
                                <SelectItem value="aes-256">AES-256</SelectItem>
                                <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                                <SelectItem value="3des">3DES</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Label>Key Algorithm</Label>
                            <Select value={asymmetricAlgorithm} onValueChange={setAsymmetricAlgorithm}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select algorithm" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                                
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="key-name">Key Name (for file download)</Label>
                          <Input
                            id="key-name"
                            placeholder="my_key"
                            value={keyName}
                            onChange={(e) => setKeyName(e.target.value)}
                          />
                        </div>

                        <div className="space-y-4">
                          <Button type="submit" className="w-full">
                            <Key className="mr-2 h-4 w-4" />
                            Generate Key
                          </Button>

                          {/* Result section - conditionally shown after generation */}
                          {result && (
                            <div className="border rounded-md p-4 space-y-3">
                              <div className="space-y-2">
                                <Label>Result</Label>
                                <div className="bg-green-50 p-3 rounded text-sm whitespace-pre-line">
                                  {result}
                                </div>
                              </div>
                            </div>
                          )}
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
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cbc">CBC</SelectItem>
                              <SelectItem value="ecb">ECB</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {blockMode === "cbc" && (
                          <div className="space-y-2">
                            <Label htmlFor="decrypt-iv">Initialization Vector (IV) - Hex</Label>
                            <Input 
                              id="decrypt-iv" 
                              placeholder="Enter the IV used for encryption" 
                              value={decryptIv}
                              onChange={(e) => setDecryptIv(e.target.value)}
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="decrypt-key-upload">Upload Key File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="decrypt-key-upload"
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
                          Decrypt File
                        </Button>

                        {decryptionResult && (
                          <div className="mt-4 border rounded-md p-4 bg-green-50 text-green-800">
                            <p>{decryptionResult}</p>
                          </div>
                        )}
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

                        <div className="space-y-2">
                          <Label>Encryption Algorithm</Label>
                          <Select defaultValue="rsa-2048" disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button type="submit" className="w-full">
                          Encrypt File
                        </Button>

                        {/* Display success or error message */}
                        {encryptionAsymmetricResult && (
                          <div className="mt-4 border rounded-md p-4 bg-green-50 text-green-800">
                            <p>{encryptionAsymmetricResult}</p>
                          </div>
                        )}
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
                          <Label>Encryption Algorithm</Label>
                          <Select defaultValue="rsa-2048" disabled>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="rsa-2048">RSA-2048</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button type="submit" className="w-full">
                          Decrypt File
                        </Button>

                        {/* Display success or error message */}
                        {decryptionAsymmetricResult && (
                          <div className="mt-4 border rounded-md p-4 bg-green-50 text-green-800">
                            <p>{decryptionAsymmetricResult}</p>
                          </div>
                        )}
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
                          <Select name="hash-algorithm" defaultValue="SHA2-256" onValueChange={(value) => setSelectedHashAlgorithm(value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SHA2-256">SHA-256 (SHA-2)</SelectItem>
                              <SelectItem value="SHA2-512">SHA-512 (SHA-2)</SelectItem>
                              <SelectItem value="SHA3-256">SHA3-256 (SHA-3)</SelectItem>
                              <SelectItem value="SHA3-512">SHA3-512 (SHA-3)</SelectItem>
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
                          <Label htmlFor="compare-file1-upload">Select First Hash File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="compare-file1-upload"
                              type="file"
                              accept=".txt"
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
                          <Label htmlFor="compare-file2-upload">Select Second Hash File</Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id="compare-file2-upload"
                              type="file"
                              accept=".txt"
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
                        <div className="text-sm text-muted-foreground mb-4">
                          <p>Upload two hash files (.txt) previously generated with the "Hash File" operation.</p>
                          <p>The system will directly compare the hash values without rehashing.</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                          {isLoading ? (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              Comparing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Compare Hashes
                            </>
                          )}
                        </Button>
                        
                        {/* Result display container */}
                        {result && (
                          <div className="mt-4 border rounded-md p-4 bg-green-50 text-green-800">
                            <div className="whitespace-pre-line">{result}</div>
                          </div>
                        )}
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
