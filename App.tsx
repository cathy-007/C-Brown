import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AdGallery } from './components/AdGallery';
import { LoadingState } from './components/LoadingState';
import { generateAdImages, generateSlogan } from './services/geminiService';
import { UploadIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);
  const [slogan, setSlogan] = useState('');
  const [isSloganLoading, setIsSloganLoading] = useState(false);
  const [generatedAds, setGeneratedAds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentScenario, setCurrentScenario] = useState<{ text: string; index: number } | null>(null);

  const handleImageUpload = (file: File) => {
    setProductImageFile(file);
    setGeneratedAds([]);
    setError(null);
    setSlogan(''); // Reset slogan on new image upload
    const reader = new FileReader();
    reader.onloadend = () => {
      setProductImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSlogan = useCallback(async () => {
    if (!productImageFile || !productImagePreview) {
      setError("Please upload a product image first to generate a slogan.");
      return;
    }
    setIsSloganLoading(true);
    setError(null);
    try {
      const base64Data = productImagePreview.split(',')[1];
      const generated = await generateSlogan(base64Data, productImageFile.type);
      setSlogan(generated);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate slogan. ${errorMessage}`);
    } finally {
      setIsSloganLoading(false);
    }
  }, [productImageFile, productImagePreview]);
  
  const handleGenerateClick = useCallback(async () => {
    if (!productImageFile || !productImagePreview) {
      setError("Please upload a product image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedAds([]);

    try {
      const base64Data = productImagePreview.split(',')[1];
      
      await generateAdImages(
        base64Data,
        productImageFile.type,
        (newAd, scenarioText, index) => {
          setGeneratedAds(prevAds => [...prevAds, newAd]);
          setCurrentScenario({ text: scenarioText, index: index + 1 });
        },
        slogan // Pass the slogan
      );

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(`Failed to generate ads. ${errorMessage}`);
    } finally {
      setIsLoading(false);
      setCurrentScenario(null);
    }
  }, [productImageFile, productImagePreview, slogan]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-8">
          
          <p className="text-center text-lg text-slate-400 mb-4">
            Follow the steps below to create stunning ad mockups for your product, complete with a catchy slogan.
          </p>
          
          {/* Step 1: Upload */}
          <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-sky-400">1. Upload Your Product Image</h2>
            <ImageUploader onImageUpload={handleImageUpload} preview={productImagePreview} />
          </div>

          {/* Step 2: Slogan */}
          <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-sky-400">2. Add a Slogan (Optional)</h2>
            <p className="text-slate-400 mb-4">Enter your own slogan or let our AI create one for you.</p>
            <textarea
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              placeholder="e.g., The Future of Innovation"
              className="w-full bg-slate-900 border border-slate-600 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition mb-4"
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={handleGenerateSlogan}
              disabled={!productImageFile || isSloganLoading || isLoading}
              className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-indigo-500/20 disabled:shadow-none"
            >
              {isSloganLoading ? (
                 <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <SparklesIcon className="w-5 h-5" />
                  <span>Generate with AI</span>
                </>
              )}
            </button>
          </div>

          {/* Step 3: Generate */}
           <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
              <h2 className="text-2xl font-bold mb-4 text-sky-400">3. Generate Mockups</h2>
              <div className="flex-grow flex flex-col items-center justify-center w-full">
                <p className="text-slate-400 mb-4 text-center">Click the button to start the magic!</p>
                <button
                  onClick={handleGenerateClick}
                  disabled={!productImageFile || isLoading}
                  className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-sky-500/20 disabled:shadow-none"
                >
                  {isLoading ? 'Generating...' : 'Generate 10 Ad Mockups'}
                </button>
              </div>
            </div>


          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative w-full text-center" role="alert">
              <strong className="font-bold">Oops! </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isLoading && currentScenario && (
            <LoadingState 
              scenarioText={currentScenario.text}
              currentIndex={currentScenario.index}
              total={10}
            />
          )}

          {generatedAds.length > 0 && (
             <div className="w-full mt-8">
                <h2 className="text-3xl font-bold text-center mb-6 text-sky-400">Your AI-Generated Ad Mockups</h2>
                <AdGallery images={generatedAds} />
             </div>
          )}

          {!isLoading && generatedAds.length === 0 && (
             <div className="w-full mt-12 text-center text-slate-500 p-8 border-2 border-dashed border-slate-700 rounded-2xl">
                <div className="flex flex-col items-center">
                  <UploadIcon className="w-16 h-16 mb-4 text-slate-600"/>
                  <h3 className="text-xl font-semibold">Your generated ads will appear here.</h3>
                  <p>Start by uploading an image and clicking generate!</p>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;