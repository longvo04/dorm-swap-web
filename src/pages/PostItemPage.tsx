import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CATEGORIES, CONDITIONS, DORM_BUILDINGS, ROUTES } from '@/utils/constants';
import { validateItemForm } from '@/utils/validators';
import { cn } from '@/utils/cn';
import type { Category, ListingType, ItemCondition } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { createPost } from '@/api';

export function PostItemPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '' as Category | '',
    condition: '' as ItemCondition | '',
    listingType: 'sell' as ListingType,
    images: [] as File[],
    building: '',
    rentUnit: '',
    rentalDeposit: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isBuildingOpen, setIsBuildingOpen] = useState(false);
  const [isRentUnitOpen, setIsRentUnitOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const RENT_UNITS = [
    { value: 'day', label: 'Day' },
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
  ];

  // Format number with dots as thousand separators
  const formatNumberWithDots = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse formatted number back to raw number
  const parseFormattedNumber = (value: string) => {
    return value.replace(/\./g, '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handlePriceChange = (field: string, value: string) => {
    const rawValue = parseFormattedNumber(value);
    const formattedValue = formatNumberWithDots(rawValue);
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files).slice(0, 5 - formData.images.length);
    if (newFiles.length === 0) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles],
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const priceValue = parseFormattedNumber(formData.price);
    const depositValue = parseFormattedNumber(formData.rentalDeposit);
    
    const validation = validateItemForm({
      title: formData.title,
      description: formData.description,
      price: priceValue ? parseInt(priceValue, 10) : undefined,
      category: formData.category,
      condition: formData.condition,
      listingType: formData.listingType,
      images: formData.images.map(f => f.name),
      rentalDeposit: depositValue ? parseInt(depositValue, 10) : undefined,
      rentalPeriodDays: formData.rentUnit ? 1 : undefined,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    try {
      setIsSubmitting(true);
      // Calculate rental period in days based on unit
      let rentalPeriodDays: number | undefined;
      if (formData.listingType === 'rent' && formData.rentUnit) {
        switch (formData.rentUnit) {
          case 'day': rentalPeriodDays = 1; break;
          case 'week': rentalPeriodDays = 7; break;
          case 'month': rentalPeriodDays = 30; break;
        }
      }

      const categoryIndex = CATEGORIES.findIndex(c => c.id === formData.category);
      const categoryId = categoryIndex >= 0 ? categoryIndex + 1 : undefined;

      await createPost(
        {
          seller_id: user?.user_id ?? 'demo-seller',
          category_id: categoryId ?? 0,
          title: formData.title,
          description: formData.description,
          price: parseInt(priceValue, 10),
          item_condition: formData.condition as ItemCondition,
          listing_type: formData.listingType,
          status: 'available',
          meetup_preference: formData.building ? `Pick up from dormitory building ${formData.building}` : undefined,
          rental_details: formData.listingType === 'rent'
            ? {
                rent_unit: formData.rentUnit || undefined,
                deposit_amount: depositValue ? parseInt(depositValue, 10) : undefined,
                min_rent_period: rentalPeriodDays,
                max_rent_period: rentalPeriodDays,
              }
            : undefined,
        },
        formData.images
      );
      
      navigate(ROUTES.PROFILE + '?tab=listings');
    } catch (error) {
      console.error('Failed to create item:', error);
      alert('Failed to post item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = CATEGORIES.find(c => c.id === formData.category);
  const selectedCondition = CONDITIONS.find(c => c.value === formData.condition);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Link */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-gray-900 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post New Item</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Photos */}
          <Card className="border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Upload Photos</h2>
            
            {formData.images.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 mb-4">
                {formData.images.map((file, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={URL.createObjectURL(file)} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            
            {formData.images.length < 5 && (
              <label className="block border-2 border-dashed border-orange-300 rounded-xl p-12 cursor-pointer hover:border-orange-400 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-700 text-center">
                    Drag and drop your images here, or{' '}
                    <span className="text-blue-600 hover:underline">browse</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB (Max 5 images)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            {errors.images && <p className="text-red-600 text-sm mt-2">{errors.images}</p>}
          </Card>

          {/* Item Details */}
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Calculus Textbook 8th Edition"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                  className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={selectedCategory ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedCategory ? selectedCategory.label : 'Select category'}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform", isCategoryOpen && "rotate-180")} />
                </button>
                {isCategoryOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {CATEGORIES.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => {
                          handleInputChange('category', category.id);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
            </div>

            {/* Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsConditionOpen(!isConditionOpen)}
                  className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={selectedCondition ? 'text-gray-900' : 'text-gray-400'}>
                    {selectedCondition ? `${selectedCondition.label}: ${selectedCondition.description}` : 'Select condition'}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform flex-shrink-0", isConditionOpen && "rotate-180")} />
                </button>
                {isConditionOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    {CONDITIONS.map((condition) => (
                      <button
                        key={condition.value}
                        type="button"
                        onClick={() => {
                          handleInputChange('condition', condition.value);
                          setIsConditionOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        <span className="font-medium">{condition.label}:</span>{' '}
                        <span className="text-gray-600">{condition.description}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.condition && <p className="text-red-600 text-sm mt-1">{errors.condition}</p>}
            </div>

            {/* Listing Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Type <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listingType"
                    value="sell"
                    checked={formData.listingType === 'sell'}
                    onChange={(e) => handleInputChange('listingType', e.target.value)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-gray-700">Sell</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="listingType"
                    value="rent"
                    checked={formData.listingType === 'rent'}
                    onChange={(e) => handleInputChange('listingType', e.target.value)}
                    className="w-4 h-4 text-gray-900"
                  />
                  <span className="text-gray-700">Rent</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="0"
                value={formData.price}
                onChange={(e) => handlePriceChange('price', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
              {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
            </div>

            {/* Rental fields */}
            {formData.listingType === 'rent' && (
              <>
                {/* Rent Unit */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rent Unit <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRentUnitOpen(!isRentUnitOpen)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
                    >
                      <span className={formData.rentUnit ? 'text-gray-900' : 'text-gray-400'}>
                        {formData.rentUnit ? RENT_UNITS.find(u => u.value === formData.rentUnit)?.label : 'Select rent unit'}
                      </span>
                      <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform", isRentUnitOpen && "rotate-180")} />
                    </button>
                    {isRentUnitOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        {RENT_UNITS.map((unit) => (
                          <button
                            key={unit.value}
                            type="button"
                            onClick={() => {
                              handleInputChange('rentUnit', unit.value);
                              setIsRentUnitOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                          >
                            {unit.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Deposit Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deposit Amount (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="0"
                    value={formData.rentalDeposit}
                    onChange={(e) => handlePriceChange('rentalDeposit', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
              </>
            )}

            {/* Building */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Building <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsBuildingOpen(!isBuildingOpen)}
                  className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:border-gray-400 transition-colors"
                >
                  <span className={formData.building ? 'text-gray-900' : 'text-gray-400'}>
                    {formData.building || 'Select building'}
                  </span>
                  <ChevronDown className={cn("h-5 w-5 text-gray-400 transition-transform", isBuildingOpen && "rotate-180")} />
                </button>
                {isBuildingOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {DORM_BUILDINGS.map((building) => (
                      <button
                        key={building}
                        type="button"
                        onClick={() => {
                          handleInputChange('building', building);
                          setIsBuildingOpen(false);
                        }}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                      >
                        {building}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Describe your item in detail..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="px-8"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-green-500 hover:bg-green-600 text-white disabled:bg-green-400"
            >
              {isSubmitting ? 'Posting...' : 'Post Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
