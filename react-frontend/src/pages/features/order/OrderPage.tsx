import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {Add01Icon,ViewIcon,Edit02Icon,Delete02Icon,Loading03Icon,MoreHorizontalCircle01Icon,} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {Card,CardContent,CardHeader,CardTitle,} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {Table,TableBody,TableCell,TableHead,TableHeader,TableRow,} from "@/components/ui/table";

import {Dialog,DialogContent,DialogHeader,DialogTitle,} from "@/components/ui/dialog";

import {DropdownMenu,DropdownMenuContent,DropdownMenuItem,DropdownMenuTrigger,} from "@/components/ui/dropdown-menu";

import {
  useDeleteOrderMutation,
  useGetOrdersQuery,
} from "@/APIs/order/ordersApi";

import CreateOrder from "./CreateOrder";
import EditOrder from "./EditOrder";
import OneOrder from "./OneOrder";

import moment from "moment"
import useAuth from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";

type PackageOption = {
  id: number;
  name: string;
  amount?: string | number;
};

type OrderPageProps = {
  packages?: PackageOption[];
};

export default function OrderPage({
  packages = [],
}: OrderPageProps) {
  const [page, setPage] = useState(1);

  const [selectedOrderId, setSelectedOrderId] =
    useState<number | null>(null);
    

  const [dialog, setDialog] = useState<
    "view" | "create" | "edit" | null
  >(null);

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetOrdersQuery({page:page, start_date: startDate , end_date: endDate});

    const orders = data?.data ?? [];
  
    const [deleteOrder, { isLoading: isDeleting }] =
    useDeleteOrderMutation();

    const {isAdmin} = useAuth()

  const currentPage = data?.current_page ?? page;
  const lastPage = data?.last_page ?? 1;

  const openView = (id: number) => {
    setSelectedOrderId(id);
    setDialog("view");
  };

  const openEdit = (id: number) => {
    setSelectedOrderId(id);
    setDialog("edit");
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      await deleteOrder(id).unwrap();
    } catch (error) {
      console.error("Failed to delete order", error);
    }
  };

  const closeDialog = () => {
    setDialog(null);
    setSelectedOrderId(null);
  };
  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Orders
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage orders.
          </p>
        </div>

        {/* <Button onClick={() => setDialog("create")}>
          <HugeiconsIcon
            icon={Add01Icon}
            size={18}
            className="mr-2"
          />
          Create Order
        </Button> */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            All Orders
          </CardTitle>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <HugeiconsIcon
                icon={Loading03Icon}
                size={28}
                className="animate-spin"
              />
            </div>
          ) : isError ? (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load orders.
            </div>
          ) : (
            <>
              <div className="flex gap-10 px-4 pb-8">
                <Input className="max-w-80" type="date" max={endDate} onChange={(e:any)=> setStartDate(e.target.value)}/>
                -
                <Input className="max-w-80" type="date" min={startDate} onChange={(e:any)=> setStartDate(e.target.value)}/>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Event Date</TableHead>
                      <TableHead>Payments</TableHead>
                      <TableHead>Job Status</TableHead>
                      {/* <TableHead>Status</TableHead> */}
                      <TableHead className="w-[70px]" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order: any) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            #{order.id}
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {order.name}
                              </p>

                              <p className="text-xs text-muted-foreground">
                                {order.email}
                              </p>
                                <p className="text-xs text-muted-foreground">
                                {order.phone}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell>
                            {order.package?.name ? (
                              <Badge variant="secondary">
                                {order.package.name}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">
                                No package
                              </span>
                            )}
                          </TableCell>

                          <TableCell className="font-medium">
                            RM{" "}
                            {Number(
                              order.amount ?? 0
                            ).toFixed(2)}
                          </TableCell>

                          <TableCell>
                              {order.date
                              ? moment(order.date).format("DD MMM YYYY hh:mm A")
                              : "-"}
                          </TableCell>

                              <TableCell>
                                  {order.payments.length == 0 ? 
                                    <span>No payment made</span> : <span>{order.payments.length} payment{order.payments.length > 1 && "s"}</span>   
                                }
                              </TableCell>

                              <TableCell>
                                  {order.status}
                              </TableCell>


                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                >
                                  <HugeiconsIcon
                                    icon={
                                      MoreHorizontalCircle01Icon
                                    }
                                    size={18}
                                  />

                                  <span className="sr-only">
                                    Open order actions
                                  </span>
                                </Button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    openView(order.id)
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={ViewIcon}
                                    size={16}
                                    className="mr-2"
                                  />
                                  View
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    openEdit(order.id)
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={Edit02Icon}
                                    size={16}
                                    className="mr-2"
                                  />
                                  Edit
                                </DropdownMenuItem>

                                {isAdmin && <DropdownMenuItem
                                  disabled={isDeleting}
                                  className="text-destructive focus:text-destructive"
                                  onClick={() =>
                                    handleDelete(order.id)
                                  }
                                >
                                  <HugeiconsIcon
                                    icon={Delete02Icon}
                                    size={16}
                                    className="mr-2"
                                  />
                                  Delete
                                </DropdownMenuItem>}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {lastPage}
                </p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() =>
                      setPage((prev) =>
                        Math.max(1, prev - 1)
                      )
                    }
                  >
                    Previous
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= lastPage}
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(lastPage, prev + 1)
                      )
                    }
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* View Order */}
      <Dialog
        open={dialog === "view"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrderId && (
            <OneOrder
              orderId={selectedOrderId}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Order */}
      <Dialog
        open={dialog === "create"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Create Order
            </DialogTitle>
          </DialogHeader>

          <CreateOrder
            packages={packages}
            onSuccess={() => {
              closeDialog();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Order */}
      <Dialog
        open={dialog === "edit"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Order
            </DialogTitle>
          </DialogHeader>

          {selectedOrderId && (
            <EditOrder
              orderId={selectedOrderId}
              packages={packages}
              onSuccess={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}