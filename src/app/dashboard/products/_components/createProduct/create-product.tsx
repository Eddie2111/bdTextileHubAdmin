"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Plus, X, ArrowLeft, ArrowRight, Upload, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Form, FormLabel } from "@/components/ui/form"

import { motion, AnimatePresence } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { LoadingSpinner } from "@/components/common/loadingSpinner"
import "react-quill/dist/quill.snow.css"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { uploadImages } from "@/lib/uploadImages"
import { colors, slideVariants } from "./create-product.constant"
import { CreateProduct_Step_1 } from "./create-product.form.step-1"
import { CreateProduct_Step_2 } from "./create-product.form.step-2"
import { createProductFormResolver } from "./create-product.helper"

import type { TCreateProductFormResolverType } from "./create-product.helper";
import { createProduct } from "@/lib/repositories/product.repository"

interface Product {
  name: string
  categories: string[]
  price: number
  quantity: number
  image: string[]
  description: string
  attributes: string
  color: string[]
}


export const CreateProduct = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<File[]>([])
  const [direction, setDirection] = useState(0)

  // Initialize form
  const form = useForm<TCreateProductFormResolverType>({
    resolver: createProductFormResolver,
    defaultValues: {
      name: "",
      categories: [],
      price: "",
      quantity: "",
      description: "",
      attributes: "",
      color: [],
    },
  })

  const nextStep = () => {
    setDirection(1)
    setCurrentStep((prev) => prev + 1)
  }

  const prevStep = () => {
    setDirection(-1)
    setCurrentStep((prev) => prev - 1)
  }

  const onDrop = (acceptedFiles: File[]) => {
    const totalFiles = [...images, ...acceptedFiles]
    if (totalFiles.length > 4) {
      toast.error("You can only upload up to 4 images.")
      return
    }
    setImages(totalFiles)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 4 - images.length,
  })

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
  }

  const onSubmit = async (data: TCreateProductFormResolverType) => {
    try {
      setIsSubmitting(true)

      // Upload images and wait for the URLs
      const uploadedUrls = await uploadImages(images);

      // Create the product entry with the uploaded image URLs
      const newProductEntry = {
        name: data.name,
        description: data.description || "",
        price: Number.parseFloat(data.price),
        image: uploadedUrls,
        quantity: Number.parseInt(data.quantity),
        attributes: data.attributes || "",
        color: data.color,
        categories: data.categories,
      }

      // Add the new product to the list
      setProducts([...products, newProductEntry])

      // Log all form data including uploaded image IDs
      console.log("Form Data:", {
        ...data,
        imageIds: uploadedUrls,
        fullProduct: newProductEntry,
      })
      const response = await createProduct(newProductEntry);
      if (response) {
        toast.success(`Created product ${data.name}`)
        setIsSubmitting(false)
        resetForm()
      }
    } catch (error) {
      setIsSubmitting(false)
      toast.error("Error creating product")
      console.error("Error creating product:", error)
    }
  }

  const resetForm = () => {
    form.reset()
    setImages([])
    setCurrentStep(1)
    setIsDialogOpen(false)
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return form.getValues().name && form.getValues().categories && form.getValues().price && form.getValues().quantity
      case 2:
        return form.getValues().color.length > 0
      case 3:
        return images.length > 0
      default:
        return true
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Fill in the details to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="relative mb-6 mt-2">
          <div className="flex justify-between">
            {[1, 2, 3, 4].map(step => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2",
                    currentStep === step
                      ? "border-green-600 bg-green-600 text-white"
                      : currentStep > step
                        ? "border-green-600 bg-white text-green-600"
                        : "border-gray-300 bg-white text-gray-400",
                  )}
                >
                  {currentStep > step ? <Check className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1",
                    currentStep >= step ? "text-green-600" : "text-gray-400",
                  )}
                >
                  {step === 1
                    ? "Details"
                    : step === 2
                      ? "Colors"
                      : step === 3
                        ? "Images"
                        : "Review"}
                </span>
              </div>
            ))}
          </div>
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 -z-10">
            <div
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="overflow-hidden">
              <AnimatePresence initial={false} custom={direction}>
                {/* Step 1: Product Details */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 py-4"
                  >
                    <CreateProduct_Step_1 form={form} />
                  </motion.div>
                )}

                {/* Step 2: Colors and Attributes */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 py-4"
                  >
                    <CreateProduct_Step_2 form={form} />
                  </motion.div>
                )}

                {/* Step 3: Image Upload */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 py-4"
                  >
                    <div className="grid gap-2">
                      <FormLabel>Upload Images (Max 4)</FormLabel>
                      <div
                        {...getRootProps()}
                        className={cn(
                          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                          "border-gray-300 hover:border-green-500",
                        )}
                      >
                        <input {...getInputProps()} />
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Drag & drop images here, or click to select files
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {images.length}/4 images uploaded
                        </p>
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {images.map((file, index) => (
                          <div
                            key={index}
                            className="relative rounded-md overflow-hidden border border-gray-200 group"
                          >
                            <img
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={`Preview ${index}`}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 4: Overview */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="grid gap-4 py-4"
                  >
                    <h3 className="text-lg font-medium">Product Overview</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Name:
                        </span>
                        <p>{form.getValues().name}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Category:
                        </span>
                        <p>{form.getValues().categories}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Price:
                        </span>
                        <p>${form.getValues().price}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Stock:
                        </span>
                        <p>{form.getValues().quantity} units</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Description:
                      </span>
                      <p className="mt-1">
                        {form.getValues().description ||
                          "No description provided."}
                      </p>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-gray-500">
                        Selected Colors:
                      </span>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {form.getValues().color.map(colorValue => {
                          const color = colors.find(
                            c => c.value === colorValue,
                          );
                          return (
                            <div
                              key={colorValue}
                              className={cn(
                                "px-3 py-1 rounded-full text-xs font-medium",
                                color?.class,
                                colorValue === "white"
                                  ? "text-black"
                                  : "text-white",
                              )}
                            >
                              {color?.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {images.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">
                          Images:
                        </span>
                        <div className="grid grid-cols-4 gap-2 mt-2">
                          {images.map((file, index) => (
                            <img
                              key={index}
                              src={
                                URL.createObjectURL(file) || "/placeholder.svg"
                              }
                              alt={`Product image ${index + 1}`}
                              className="w-full h-16 object-cover rounded-md border border-gray-200"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <DialogFooter className="flex justify-between">
              {currentStep > 1 ? (
                <Button variant="outline" onClick={prevStep} type="button">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  type="button"
                >
                  Cancel
                </Button>
              )}

              {currentStep < 4 ? (
                <Button
                  onClick={e => {
                    e.preventDefault();
                    if (isStepValid()) {
                      nextStep();
                    }
                  }}
                  disabled={!isStepValid()}
                  className="bg-green-600 hover:bg-green-700"
                  type="button"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <LoadingSpinner /> : "Submit"}
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

