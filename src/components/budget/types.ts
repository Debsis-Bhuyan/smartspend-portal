export interface Budget {
  id?: number;
  month: number;
  year: number;
  amount: number;
  category: string;
  color:string;
  spent:number;
  user?: {
    id: number;
    username: string;
  };
}