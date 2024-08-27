import clsx from "clsx";
import {
  EllipseGreenSolid,
  EllipseGreySolid,
  EllipsisHorizontal,
  ExclamationCircle,
  PencilSquare,
  Spinner,
  Trash,
} from "@medusajs/icons";
import { DateComparisonOperator, PriceList } from "@medusajs/medusa";
import {
  Container,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  StatusBadge,
  Table,
  Text,
  clx,
  usePrompt,
} from "@medusajs/ui";
import {
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ProductVariant, useAdminProducts } from "medusa-react";
import { Product } from "@medusajs/medusa";
import * as React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Spacer from "../../../components/atoms/spacer";
import { FilterMenu } from "../../../components/molecules/filter-menu";
import { useDebouncedSearchParam } from "../../../hooks/use-debounced-search-param";
import useNotification from "../../../hooks/use-notification";
import { getErrorMessage } from "../../../utils/error-messages";
import {
  getDateComparisonOperatorFromSearchParams,
  getStringArrayFromSearchParams,
  getStringFromSearchParams,
} from "../../../utils/search-param-utils";
import ListIcon from "../../fundamentals/icons/list-icon";
import TileIcon from "../../fundamentals/icons/tile-icon";
import { useAdminStore } from "medusa-react";
import { PricedProduct } from "@medusajs/medusa/dist/types/pricing";
import ImagePlaceholder from "../../fundamentals/image-placeholder";
import { defaultChannelsSorter } from "../../../utils/sales-channel-compare-operator";
import DelimitedList from "../../molecules/delimited-list";
import { ProductCategory } from "@medusajs/medusa";
import { useTranslation } from "react-i18next";
import { renderToString } from "react-dom/server";
import ProductOverview from "./overview";

const PAGE_SIZE = 10;
const PAGE_SIZE_TILE_VIEW = 18;
const TABLE_HEIGHT = (PAGE_SIZE + 1) * 48;

const CategoryFilters = (category) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const onCategoryChange = (category: string[]) => {
    const current = new URLSearchParams(searchParams);

    if (category.length === 0) {
      current.delete("category");
      navigate({ search: current.toString() }, { replace: true });

      return;
    }

    if (current.has("category")) {
      current.delete("category");
    }

    current.set("category", category.join(","));
    navigate({ search: current.toString() }, { replace: true });
  };

  const onClearFilters = () => {
    const reset = new URLSearchParams();

    navigate({ search: reset.toString() }, { replace: true });
  };

  const options = category.category_children
    ? category.category_children.map((c: { name: string; id: string }) => ({
        label: c.name,
        value: c.id,
      }))
    : [];

  return (
    <FilterMenu onClearFilters={onClearFilters}>
      <FilterMenu.Content>
        <FilterMenu.SelectItem
          name="Category"
          onChange={onCategoryChange}
          options={options}
          value={getStringArrayFromSearchParams("category", searchParams)}
        />
      </FilterMenu.Content>
    </FilterMenu>
  );
};

const ProductTable = (category) => {
  const { t } = useTranslation();

  // const { store } = useAdminStore();

  // const getProductSalesChannels = (salesChannels) => {
  //   const salesChannelsNames = (salesChannels || [])
  //     .sort(defaultChannelsSorter(store?.default_sales_channel_id || ""))
  //     .map((sc) => sc.name);

  //   return <DelimitedList list={salesChannelsNames} />;
  // };

  const setTileView = () => {
    setLimit(PAGE_SIZE_TILE_VIEW);
    setShowList(false);
  };

  const setListView = () => {
    setLimit(PAGE_SIZE);
    setShowList(true);
  };

  const [limit, setLimit] = React.useState(0);

  const [showList, setShowList] = React.useState(false);

  const columnHelper = createColumnHelper<Product | PricedProduct>();

  const columns = [
    columnHelper.accessor("title", {
      header: "Name",
      cell: ({ row: { original } }) => {
        return (
          <div className="flex items-center">
            <div className="my-1.5 mr-4 flex h-[40px] w-[30px] items-center">
              {original.thumbnail ? (
                <img
                  src={original.thumbnail}
                  className="rounded-soft h-full object-cover"
                />
              ) : (
                <ImagePlaceholder />
              )}
            </div>
            {original.title}
          </div>
        );
      },
    }),
    columnHelper.accessor("variants", {
      header: "Inventory",
      cell: (info) => {
        const values = info.getValue() as any[];

        <div>
          {values.reduce(
            (acc: number, next) => acc + next.inventory_quantity,
            0
          )}
          {t(
            "product-table-inventory-in-stock-count",
            " in stock for {{count}} variant(s)",
            { count: info.getValue().length }
          )}
        </div>;
      },
    }),
  ];

  const [searchParams] = useSearchParams();

  const { query, setQuery } = useDebouncedSearchParam();

  const navigate = useNavigate();

  const { products, count, isLoading, isError } = useAdminProducts(
    {
      fields: "id,title,thumbnail",
      limit: PAGE_SIZE,
      category_id:
        searchParams.has("category") &&
        getStringArrayFromSearchParams("category", searchParams)?.length > 0
          ? (getStringArrayFromSearchParams(
              "category",
              searchParams
            ) as string[])
          : [category.id], // categoryId should be the variable holding the direct category ID
      q: getStringFromSearchParams("q", searchParams),
      expand: "variants,variants.prices,tags,images",
    },
    {
      keepPreviousData: true,
    }
  );

  const table = useReactTable<Product | PricedProduct>({
    data: products ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <Container
        style={{
          // height: TABLE_HEIGHT + 143, // Table height + header height + pagination height
          height: TABLE_HEIGHT,
        }}
        className="flex items-center justify-center"
      >
        <Spinner className="text-ui-fg-subtle animate-spin" />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container
        style={{
          // height: TABLE_HEIGHT + 143, // Table height + header height + pagination height
          height: TABLE_HEIGHT,
        }}
        className="flex items-center justify-center"
      >
        <div className="flex items-center gap-x-2">
          <ExclamationCircle className="text-ui-fg-base" />
          <Text className="text-ui-fg-subtle">
            An error occurred while loading the products. Try to reload the page
            or try again later.
          </Text>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-y-2">
        <Container className="overflow-hidden p-0">
          {/* <div className="flex items-center justify-between px-8 pt-6 pb-4"> */}
          <div className="flex w-full justify-between items-center px-8 pt-6 pb-4">
            {/* <Heading>Price Lists</Heading> */}
            <div className="gap-x-xsmall flex self-end">
              <CategoryFilters {...category} />
            </div>
            <div className="gap-x-xsmall flex items-center">
              <Input
                size="small"
                type="search"
                placeholder="Search"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
              />
            </div>
          </div>
          <div
            style={{
              height: TABLE_HEIGHT,
            }}
          >
            <Table>
              {showList ? (
                <>
                  <Table.Header className="inter-small-semibold text-grey-50 border-grey-20 whitespace-nowrap border-t border-b">
                    {table.getHeaderGroups().map((headerGroup) => {
                      return (
                        <Table.Row
                          key={headerGroup.id}
                          // className="[&_th]:w-1/5 [&_th:last-of-type]:w-[1%]"
                        >
                          {headerGroup.headers?.map((header) => {
                            return (
                              <Table.HeaderCell
                                key={header.id}
                                className="min-w-[100px]"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </Table.HeaderCell>
                            );
                          })}
                          <th>
                            <div className="flex justify-end text-right">
                              <span
                                onClick={setListView}
                                className={clsx(
                                  "hover:bg-grey-5 cursor-pointer rounded p-0.5",
                                  {
                                    "text-grey-90": showList,
                                    "text-grey-40": !showList,
                                  }
                                )}
                              >
                                <ListIcon size={20} />
                              </span>
                              <span
                                onClick={setTileView}
                                className={clsx(
                                  "hover:bg-grey-5 cursor-pointer rounded p-0.5",
                                  {
                                    "text-grey-90": !showList,
                                    "text-grey-40": showList,
                                  }
                                )}
                              >
                                <TileIcon size={20} />
                              </span>
                            </div>
                          </th>
                        </Table.Row>
                      );
                    })}
                  </Table.Header>
                  <Table.Body className="border-b-0">
                    {table.getRowModel().rows?.map((row) => (
                      <Table.Row
                        key={row.id}
                        // className={clx("cursor-pointer [&_td:last-of-type]:w-[1%]")}
                        className="inter-small-regular border-grey-20 text-grey-90 border-t border-b hover:bg-grey-5"
                        onClick={() => {
                          navigate(`/a/products/${row.original.id}`);
                        }}
                      >
                        {row.getVisibleCells()?.map((cell) => (
                          <Table.Cell
                            key={cell.id}
                            className="inter-small-regular h-[40px]"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </>
              ) : (
                <ProductOverview
                  products={products}
                  toggleListView={setListView}
                />
              )}
            </Table>
          </div>
          <Table.Pagination
            className={clx({
              "inter-small-regular text-grey-50 border-ui-border-base border-t":
                products?.length !== PAGE_SIZE,
            })}
            count={count ?? 0}
            canNextPage={table.getCanNextPage()}
            canPreviousPage={table.getCanPreviousPage()}
            nextPage={table.nextPage}
            previousPage={table.previousPage}
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={PAGE_SIZE}
          />
        </Container>
        {/* <Spacer /> */}
      </div>
    </div>
  );
};

export { ProductTable };
