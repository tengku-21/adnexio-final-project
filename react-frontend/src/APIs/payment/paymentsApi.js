import { apiSlice } from "../api/apiSlice";

export const paymentsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayments: builder.query({
      query: (page = 1) => ({
        url: "/payments",
        params: {
          page,
        },
      }),
    }),

    getPayment: builder.query({
      query: (id) => `/payments/${id}`,
    }),

    createPayment: builder.mutation({
      query: (payment) => ({
        url: "/payments",
        method: "POST",
        body: payment,
      }),
      invalidatesTags: (result, error, { order_id }) => [
        { type: "Orders", order_id },
        { type: "Orders", id: "LIST" },
      ],
    }),

    updatePayment: builder.mutation({
      query: ({ id, ...payment }) => ({
        url: `/payments/${id}`,
        method: "PUT",
        body: payment,
      }),
    }),
  }),
});

export const {
  useGetPaymentsQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  useUpdatePaymentMutation,
} = paymentsApi;