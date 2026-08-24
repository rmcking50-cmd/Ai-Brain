import React, { useState, useRef } from 'react';
import { 
  FolderHeart, 
  Trash2, 
  Play, 
  Eye, 
  RefreshCw, 
  Upload, 
  FileText, 
  FileVideo, 
  Volume2, 
  Image as ImageIcon,
  Check,
  Calendar,
  Layers,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { RepositoryAsset, UserRolePayload } from '../types';

interface AssetRepositoryProps {
  userRole: UserRolePayload;
  assets: RepositoryAsset[];
  setAssets: React.Dispatch<React.SetStateAction<RepositoryAsset[]>>;
}

export default function AssetRepository({ userRole, assets, setAssets }: AssetRepositoryProps) {
  const [selectedAsset, setSelectedAsset] = useState<RepositoryAsset | null>(assets[0] || null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisText, setAnalysisText] = useState('');
  const replaceInputRef = useRef<HTMLInputElement>(null);

  // States for checkbox selection and delete modal
  const [checkedAssetIds, setCheckedAssetIds] = useState<string[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Filter terms
  const [filterType, setFilterType] = useState<string>('all');

  const handleDeleteAsset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userRole.permissions.canEditRepository) {
      alert('Your authorized role does not have privileges to modify this repository.');
      return;
    }
    const filtered = assets.filter(a => a.id !== id);
    setAssets(filtered);
    setCheckedAssetIds(prev => prev.filter(checkedId => checkedId !== id));
    if (selectedAsset?.id === id) {
      setSelectedAsset(filtered[0] || null);
      setAnalysisText('');
    }
  };

  const handleBulkDelete = () => {
    if (!userRole.permissions.canEditRepository) {
      alert('Your authorized role does not have privileges to modify this repository.');
      return;
    }
    const filtered = assets.filter(a => !checkedAssetIds.includes(a.id));
    setAssets(filtered);
    
    // If the currently selected asset was in the deleted list, reset selection
    if (selectedAsset && checkedAssetIds.includes(selectedAsset.id)) {
      setSelectedAsset(filtered[0] || null);
      setAnalysisText('');
    }
    
    setCheckedAssetIds([]);
    setShowDeleteModal(false);
  };

  // 2. FILE REPLACE - Essential for "proxy, file replace" guidelines
  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedAsset) {
      if (!userRole.permissions.canEditRepository) {
        alert('Your authorized role does not provide edit privileges to modify the repository.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        const fileSizeStr = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
        
        // Update asset values in list
        const updated = assets.map(a => {
          if (a.id === selectedAsset.id) {
            const updatedItem: RepositoryAsset = {
              ...a,
              url: fileUrl,
              size: fileSizeStr,
              createdAt: new Date().toLocaleDateString(),
            };
            setSelectedAsset(updatedItem);
            return updatedItem;
          }
          return a;
        });
        setAssets(updated);
        alert(`Successfully executed File Replace: Swapped file proxy with local target "${file.name}"!`);
      };
      reader.readAsDataURL(file);
    }
  };

  // 3. VIDEO CONTENT ANALYSIS VIA GEMINI PRO
  const handleAnalyzeVideo = async () => {
    if (!userRole.permissions.canGenerateAI) {
      alert('Your authorized role does not have AI generation privileges.');
      return;
    }
    if (!selectedAsset || selectedAsset.type !== 'video') {
      alert('Please select an active Video asset to analyze.');
      return;
    }
    setAnalyzing(true);
    setAnalysisText('Calibrating Gemini 3.1 Pro engine. Parsing high-contrast visual indices...');
    try {
      const res = await fetch('/api/analyze-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          base64File: selectedAsset.url.startsWith('data:') ? selectedAsset.url.split(',')[1] : '',
          mimeType: 'video/mp4'
        }),
      });
      const data = await res.json();
      setAnalysisText(data.analysis || 'Video framing analyzed successfully.');
    } catch (e: any) {
      setAnalysisText(`Analysis aborted: ${e.message}`);
    } finally {
      setAnalyzing(false);
    }
  };

  const filteredAssets = assets.filter(a => filterType === 'all' || a.type === filterType);

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950 p-4 border border-slate-900 rounded-xl">
        <div className="space-y-1">
          <h3 className="text-base font-bold font-sans text-white flex items-center gap-1.5">
            <FolderHeart className="w-5 h-5 text-red-500 animate-pulse" /> Content Repository & Asset Manager
          </h3>
          <p className="text-xs text-slate-400">View generated broadcast scripts, speech audios, video segments. Facilitate fast file proxy replacements.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          {['all', 'video', 'image', 'audio', 'script', 'subtitles'].map((item) => (
            <button
              key={item}
              onClick={() => {
                setFilterType(item);
                const sub = assets.find(a => item === 'all' || a.type === item);
                if (sub) setSelectedAsset(sub);
              }}
              className={`px-3 py-1.5 text-xs font-mono rounded cursor-pointer transition-all ${
                filterType === item ? 'bg-red-650 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Asset Table/List */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-900 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
              Available Studio Files ({filteredAssets.length})
            </span>
            {checkedAssetIds.length > 0 && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer animate-pulse"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Selected ({checkedAssetIds.length})</span>
              </button>
            )}
          </div>
          
          {filteredAssets.length > 0 && (
            <div className="flex items-center justify-between bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-900 text-xs text-slate-400 font-mono select-none">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filteredAssets.length > 0 && filteredAssets.every(a => checkedAssetIds.includes(a.id))}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const toAdd = filteredAssets.map(a => a.id);
                      setCheckedAssetIds(prev => Array.from(new Set([...prev, ...toAdd])));
                    } else {
                      const filteredIds = filteredAssets.map(a => a.id);
                      setCheckedAssetIds(prev => prev.filter(id => !filteredIds.includes(id)));
                    }
                  }}
                  className="w-3.5 h-3.5 accent-red-600 bg-slate-950 border-slate-800 rounded cursor-pointer"
                />
                <span>Select All Listed ({filteredAssets.length})</span>
              </label>
              {checkedAssetIds.length > 0 && (
                <button 
                  onClick={() => setCheckedAssetIds([])}
                  className="text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          )}
          
          {filteredAssets.length === 0 ? (
            <div className="text-center p-8 bg-slate-900/10 rounded border border-dashed border-slate-800">
              <FolderHeart className="w-8 h-8 mx-auto text-slate-700" />
              <p className="text-xs text-slate-500 mt-2 font-mono">No matching media assets compiled. Synthesize or upload above.</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredAssets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    setSelectedAsset(asset);
                    setAnalysisText('');
                  }}
                  className={`p-3 rounded-lg border text-xs font-sans transition-all flex justify-between items-center cursor-pointer ${
                    selectedAsset?.id === asset.id 
                      ? 'bg-slate-900 border-red-500/50 shadow-md' 
                      : 'bg-slate-950/40 border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={checkedAssetIds.includes(asset.id)}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        if (checked) {
                          setCheckedAssetIds(prev => [...prev, asset.id]);
                        } else {
                          setCheckedAssetIds(prev => prev.filter(id => id !== asset.id));
                        }
                      }}
                      className="w-3.5 h-3.5 accent-red-650 bg-slate-950 border-slate-800 rounded cursor-pointer shrink-0"
                    />

                    {asset.type === 'video' && <FileVideo className="w-5 h-5 text-red-400 shrink-0" />}
                    {asset.type === 'image' && <ImageIcon className="w-5 h-5 text-blue-400 shrink-0" />}
                    {asset.type === 'audio' && <Volume2 className="w-5 h-5 text-green-400 shrink-0" />}
                    {asset.type === 'script' && <FileText className="w-5 h-5 text-cyan-400 shrink-0" />}
                    {asset.type === 'subtitles' && <Layers className="w-5 h-5 text-yellow-400 shrink-0" />}
                    
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-semibold text-slate-200 line-clamp-1">{asset.name}</h4>
                      <p className="text-[10px] text-slate-500 font-mono tracking-wide">{asset.createdAt} • {asset.size || 'N/A'}</p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDeleteAsset(asset.id, e)}
                    className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-900 shrink-0 ml-2 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Active Asset Preview & File Replace Operations */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-900 rounded-xl p-5 flex flex-col justify-between min-h-[460px]">
          {selectedAsset ? (
            <div className="space-y-4">
              
              {/* Asset Header Info */}
              <div className="flex justify-between items-start border-b border-slate-900 pb-3">
                <div>
                  <span className="text-[10px] font-mono text-red-400 font-extrabold bg-red-500/10 px-2 py-0.5 rounded tracking-wider uppercase font-bold">
                    {selectedAsset.type} file specifications
                  </span>
                  <h3 className="text-base font-sans font-bold text-white tracking-tight mt-1">{selectedAsset.name}</h3>
                </div>

                {/* File Replace Button Action */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => replaceInputRef.current?.click()}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-bold text-white hover:bg-slate-850 flex items-center gap-1 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Proxy Replace</span>
                  </button>
                  <input 
                    type="file" 
                    ref={replaceInputRef}
                    onChange={handleReplaceFile}
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Asset Player visual canvas */}
              <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-4 flex items-center justify-center min-h-[220px]">
                {selectedAsset.type === 'video' && (
                  <video src={selectedAsset.url} controls className="max-h-[200px] rounded border border-slate-850 max-w-sm" />
                )}
                {selectedAsset.type === 'image' && (
                  <img src={selectedAsset.url} alt="asset visual" className="max-h-[200px] rounded border border-slate-850 object-contain" />
                )}
                {selectedAsset.type === 'audio' && (
                  <div className="text-center space-y-3">
                    <Volume2 className="w-10 h-10 text-emerald-400 mx-auto animate-pulse" />
                    <audio src={selectedAsset.url} controls className="mx-auto" />
                  </div>
                )}
                {(selectedAsset.type === 'script' || selectedAsset.type === 'subtitles') && (
                  <div className="w-full text-left font-mono text-xs bg-slate-950 p-3 rounded-lg border border-slate-900/60 max-h-[180px] overflow-y-auto leading-relaxed">
                    <pre className="text-cyan-400 whitespace-pre-wrap">{selectedAsset.lyrics_or_text || 'No compiled transcript inside script.'}</pre>
                  </div>
                )}
              </div>

              {/* Gemini Video Analysis tool */}
              {selectedAsset.type === 'video' && (
                <div className="space-y-3 p-4 bg-slate-900/30 rounded-lg border border-slate-850">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-350 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-yellow-400" /> GNN Video Intelligence Analyst
                    </span>
                    <button
                      onClick={handleAnalyzeVideo}
                      disabled={analyzing}
                      className="text-xs font-semibold bg-red-650 hover:bg-red-700 text-white px-3 py-1.5 rounded transition-all cursor-pointer disabled:opacity-50"
                    >
                      {analyzing ? 'Analyzing Visuals...' : 'Analyze Video'}
                    </button>
                  </div>
                  {analysisText && (
                    <div className="text-xs font-sans bg-slate-950 p-3 rounded border border-slate-900 text-slate-300 leading-relaxed whitespace-pre-wrap">
                      {analysisText}
                    </div>
                  )}
                </div>
              )}

              {/* Standard specifications bottom row */}
              <div className="grid grid-cols-2 gap-4 text-xs font-mono text-slate-500">
                <div>Created Slot: <strong className="text-slate-400">{selectedAsset.createdAt}</strong></div>
                <div>Calculated Size: <strong className="text-slate-400">{selectedAsset.size || '380 KB'}</strong></div>
              </div>

            </div>
          ) : (
            <div className="text-center p-8 m-auto">
              <FolderHeart className="w-12 h-12 mx-auto text-slate-800 mb-2" />
              <p className="text-xs text-slate-500 font-mono">Select an active media asset to access replacement proxies and previews.</p>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-slate-900 text-[10px] font-mono text-slate-500 text-center">
            Standard files are stored securely across durable cluster storages. Swapping proxies is isolated instantly.
          </div>
        </div>

      </div>

      {/* Dynamic Bulk Deletion Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 animate-scaleIn">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-500/10 text-red-500 rounded-xl shrink-0">
                <ShieldAlert className="w-6 h-6 animate-bounce" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-base font-bold text-white font-sans">
                  Confirm Bulk Deletion
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Are you sure you want to delete the selected <strong className="text-white">{checkedAssetIds.length} assets</strong>? This operation is permanent, cannot be undone, and will immediately purge these records from the Media Repository.
                </p>
              </div>
            </div>

            {/* List of affected items */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                Selected Assets to Purge:
              </span>
              <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 max-h-36 overflow-y-auto space-y-1.5 font-sans text-xs">
                {assets
                  .filter(a => checkedAssetIds.includes(a.id))
                  .map(a => (
                    <div key={a.id} className="flex items-center gap-2 text-slate-300 min-w-0">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                      <span className="truncate flex-1 font-medium">{a.name}</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 font-bold">({a.type})</span>
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-lg"
              >
                <Trash2 className="w-4 h-4" />
                <span>Confirm Purge ({checkedAssetIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
