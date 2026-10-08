export type Package = {
    id: string;
    name: string;
    detail: string;
    amount: number;
    popular: boolean;
};

export type PackageData = {
  data: Package[];
  [key: string]: unknown;
};