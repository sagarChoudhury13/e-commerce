import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ProductPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ProductPagination({ currentPage, totalPages }: ProductPaginationProps) {
  // Hide pagination entirely if there is only 1 page of products
  if (totalPages <= 1) return null;

  return (
    <Pagination className="mt-12">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            href={currentPage > 1 ? `/products?page=${currentPage - 1}` : "#"} 
            aria-disabled={currentPage <= 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
        
        <PaginationItem>
          <span className="text-sm font-medium text-muted-foreground mx-4">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>

        <PaginationItem>
          <PaginationNext 
            href={currentPage < totalPages ? `/products?page=${currentPage + 1}` : "#"} 
            aria-disabled={currentPage >= totalPages}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default ProductPagination