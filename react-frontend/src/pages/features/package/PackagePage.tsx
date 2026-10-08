import { useEffect, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  ViewIcon,
  Edit02Icon,
  Delete02Icon,
  Loading03Icon,
  MoreHorizontalCircle01Icon,
} from "@hugeicons/core-free-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  useDeletePackageMutation,
  useGetPackagesQuery,
} from "@/APIs/package/packagesApi";

import CreateOrder from "./CreatePackage";
import EditOrder from "./EditPackage";
import OneOrder from "./OnePackage";

import moment from "moment"
import CreatePackage from "./CreatePackage";
import DocumentGallery from "../documents/DocumentGallery";
import useAuth from "@/hooks/useAuth";

type PackageOption = {
  id: number;
  name: string;
  amount?: string | number;
};

type OrderPageProps = {
  packages?: PackageOption[];
};

export default function PackagePage({}: OrderPageProps) {
  const [page, setPage] = useState(1);

  const [selectedOrderId, setSelectedOrderId] =
    useState<number | null>(null);
    
  const {isAdmin} = useAuth()

  const [dialog, setDialog] = useState<
    "view" | "create" | "edit" | null
  >(null);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useGetPackagesQuery(page);

    const orders = data?.data ?? [];
  
    const [deleteOrder, { isLoading: isDeleting }] =
    useDeletePackageMutation();


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
      "Are you sure you want to delete this package?"
    );

    if (!confirmed) return;

    try {
      await deleteOrder(id).unwrap();
    } catch (error) {
      console.error("Failed to delete package", error);
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
            Packages
          </h1>

          <p className="text-sm text-muted-foreground">
            Manage Packages.
          </p>
        </div>

        <Button onClick={() => setDialog("create")}>
          <HugeiconsIcon
            icon={Add01Icon}
            size={18}
            className="mr-2"
          />
          Create Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            All Packages
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
              Failed to load packages.
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Attached</TableHead>
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
                            </div>
                          </TableCell>

                          <TableCell>
                            {order.detail}
                          </TableCell>

                              <TableCell className="font-medium">
                                  RM{" "}
                                  {Number(
                                      order.amount ?? 0
                                  ).toFixed(2)}
                              </TableCell>

                              
                              <TableCell className="font-medium">
                                 <DocumentGallery documents={order.documents}/>
                              </TableCell>

                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
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

                                <DropdownMenuItem
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
                                </DropdownMenuItem>
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
              Create Package
            </DialogTitle>
          </DialogHeader>

          <CreatePackage
            onSuccess={() => {
              closeDialog();
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Package */}
      <Dialog
        open={dialog === "edit"}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Edit Package
            </DialogTitle>
          </DialogHeader>

          {selectedOrderId && (
            <EditOrder
              orderId={selectedOrderId}
              onSuccess={closeDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}