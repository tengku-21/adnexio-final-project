import { apiSlice } from "../api/apiSlice";

export const packagesApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPackages: builder.query({
            query: (page = 1) => ({
                url: "/packages",
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

        getPackage: builder.query({
            query: (id) => `/packages/${id}`,
            providesTags: (result, error, id) => [{ type: "Packages", id }],
        }),

        createPackage: builder.mutation({
            query: (packageData) => ({
                url: "/packages",
                method: "POST",
                body: packageData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Packages", id },
                { type: "Packages", id: "LIST" },
            ],
        }),

        updatePackage: builder.mutation({
            query: ({ id, ...packageData }) => ({
                url: `/packages/${id}`,
                method: "PUT",
                body: packageData,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Packages", id },
                { type: "Packages", id: "LIST" },
            ],
        }),

        deletePackage: builder.mutation({
            query: (id) => ({
                url: `/packages/${id}`,
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
    useGetPackagesQuery,
    useGetPackageQuery,
    useCreatePackageMutation,
    useUpdatePackageMutation,
    useDeletePackageMutation,
} = packagesApi;