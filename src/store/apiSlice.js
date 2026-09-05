import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl:
      import.meta.env.VITE_API_BASE_URL ||
      "https://doc-flow-backend-master-production.up.railway.app/api",
  }),
  endpoints: (builder) => ({
    // Health
    checkHealth: builder.query({
      query: () => "/health",
    }),

    // PDF Endpoints
    pdfAnnotate: builder.mutation({
      query: (formData) => ({
        url: "/pdf/annotate",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    pdfMerge: builder.mutation({
      query: (formData) => ({
        url: "/pdf/merge",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    pdfSplit: builder.mutation({
      query: (formData) => ({
        url: "/pdf/split",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    pdfInfo: builder.mutation({
      query: (formData) => ({
        url: "/pdf/info",
        method: "POST",
        body: formData,
      }),
    }),
    pdfToDocx: builder.mutation({
      query: (formData) => ({
        url: "/pdf/convert/docx",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    pdfToHtml: builder.mutation({
      query: (formData) => ({
        url: "/pdf/convert/html",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.text(),
      }),
    }),
    htmlToPdf: builder.mutation({
      query: (formData) => ({
        url: "/pdf/convert/html-to-pdf",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Excel Endpoints
    excelMerge: builder.mutation({
      query: (formData) => ({
        url: "/excel/merge",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    excelSplit: builder.mutation({
      query: (formData) => ({
        url: "/excel/split",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    excelToJson: builder.mutation({
      query: (formData) => ({
        url: "/excel/to-json",
        method: "POST",
        body: formData,
      }),
    }),
    jsonToExcel: builder.mutation({
      query: (data) => ({
        url: "/excel/from-json",
        method: "POST",
        body: data, // JSON data
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Image Endpoints
    imageEdit: builder.mutation({
      query: (formData) => ({
        url: "/image/edit",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    imageMerge: builder.mutation({
      query: (formData) => ({
        url: "/image/merge",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    imageSplit: builder.mutation({
      query: (formData) => ({
        url: "/image/split",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    imageCompress: builder.mutation({
      query: (formData) => ({
        url: "/image/compress",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Word Endpoints
    wordMerge: builder.mutation({
      query: (formData) => ({
        url: "/word/merge",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    wordSplit: builder.mutation({
      query: (formData) => ({
        url: "/word/split",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
    wordToHtml: builder.mutation({
      query: (formData) => ({
        url: "/word/convert/html",
        method: "POST",
        body: formData,
      }),
    }),
    htmlToDocx: builder.mutation({
      query: (formData) => ({
        url: "/word/convert/docx",
        method: "POST",
        body: formData,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useCheckHealthQuery,
  usePdfAnnotateMutation,
  usePdfMergeMutation,
  usePdfSplitMutation,
  usePdfInfoMutation,
  usePdfToDocxMutation,
  usePdfToHtmlMutation,
  useExcelMergeMutation,
  useExcelSplitMutation,
  useExcelToJsonMutation,
  useJsonToExcelMutation,
  useImageEditMutation,
  useImageMergeMutation,
  useImageSplitMutation,
  useImageCompressMutation,
  useWordMergeMutation,
  useWordSplitMutation,
  useWordToHtmlMutation,
  useHtmlToDocxMutation,
  useHtmlToPdfMutation,
} = apiSlice;
