import { apiSlice } from "../api/apiSlice";

export const documentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: (page = 1) => ({
        url: "/documents",
        params: {
          page,
        },
      }),
       providesTags: (result) =>
        result
          ? [
              { type: "Packages", id: "LIST" },
              ...result.data.map(({ id }) => ({
                type: "Packages",
                id,
              })),
            ]
          : [{ type: "Packages", id: "LIST" }],
    }),

    getDocument: builder.query({
      query: (id) => `/documents/${id}`,
      providesTags: (result, error, id) => [{ type: "Packages", id }],
    }),

    createDocument: builder.mutation({
      query: ({
        file,
        order_id = null,
        payment_id = null,
        package_id = null,
      }) => {
        const formData = new FormData();

        formData.append("file", file);

        if (order_id !== null) {
          formData.append("order_id", order_id);
        }

        if (payment_id !== null) {
          formData.append("payment_id", payment_id);
        }

        if (package_id !== null) {
          formData.append("package_id", package_id);
        }

        return {
          url: "/documents",
          method: "POST",
          body: formData,
        };
      },
            invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),

    deleteDocument: builder.mutation({
      query: (id) => ({
        url: `/documents/${id}`,
        method: "DELETE",
      }),
            invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id },
        { type: "Packages", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetDocumentsQuery,
  useGetDocumentQuery,
  useCreateDocumentMutation,
  useDeleteDocumentMutation,
} = documentsApi;