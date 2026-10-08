import { apiSlice } from "../api/apiSlice";

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: (page = 1) => ({
        url: "/orders",
        params: { page },
      }),
      providesTags: (result) =>
        result
          ? [
              { type: "Orders", id: "LIST" },
              ...result.data.map(({ id }) => ({
                type: "Orders",
                id,
              })),
            ]
          : [{ type: "Orders", id: "LIST" }],
    }),

    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "Orders", id }],
    }),

    createOrder: builder.mutation({
      query: (order) => ({
        url: "/orders",
        method: "POST",
        body: order,
      }),
      invalidatesTags: [{ type: "Orders", id: "LIST" }],
    }),

    updateOrder: builder.mutation({
      query: ({ id, ...order }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: order,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Orders", id },
        { type: "Orders", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
} = ordersApi;
