import clsx from "clsx";
import { useMemo, useEffect, useState } from "react";
import { useAdminProductTags, useAdminCollections } from "medusa-react";
import { useTranslation } from "react-i18next";
import CheckIcon from "../../components/fundamentals/icons/check-icon";
import PlusIcon from "../../components/fundamentals/icons/plus-icon";
import { FilterMenu } from "../../components/molecules/filter-menu";
import TagInput from "../../components/molecules/tag-input";
import TabFilter from "../../components/molecules/filter-tab";

const statusFilters = ["proposed", "draft", "published", "rejected"];

const COLLECTION_PAGE_SIZE = 10;

const ProductsFilter = ({
  filters,
  submitFilters,
  clearFilters,
  tabs,
  onTabClick,
  activeTab,
  onRemoveTab,
  onSaveTab,
}) => {
  const { t } = useTranslation();
  const [tempState, setTempState] = useState(filters);
  const [name, setName] = useState("");

  const handleRemoveTab = (val) => {
    if (onRemoveTab) {
      onRemoveTab(val);
    }
  };

  const handleSaveTab = () => {
    if (onSaveTab) {
      onSaveTab(name, tempState);
    }
  };

  const handleTabClick = (tabName: string) => {
    if (onTabClick) {
      onTabClick(tabName);
    }
  };

  useEffect(() => {
    setTempState(filters);
  }, [filters]);

  const onSubmit = () => {
    submitFilters(tempState);
  };

  const onClear = () => {
    clearFilters();
  };

  interface FilterValue {
    open?: boolean;
    // Add other properties of value here as needed
  }
  const numberOfFilters = useMemo(
    () =>
      Object.entries(filters || {}).reduce((acc, [, value]) => {
        if ((value as FilterValue)?.open) {
          acc = acc + 1;
        }
        return acc;
      }, 0),
    [filters]
  );

  const setSingleFilter = (filterKey, filterVal) => {
    setTempState((prevState) => ({
      ...prevState,
      [filterKey]: filterVal,
    }));
  };

  const [collectionsPagination, setCollectionsPagination] = useState({
    offset: 0,
    limit: COLLECTION_PAGE_SIZE,
  });

  const {
    collections,
    count,
    isLoading: isLoadingCollections,
  } = useAdminCollections(collectionsPagination);

  const { product_tags } = useAdminProductTags();

  const handlePaginateCollections = (direction) => {
    if (direction > 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    } else if (direction < 0) {
      setCollectionsPagination((prev) => ({
        ...prev,
        offset: Math.max(prev.offset - prev.limit, 0),
      }));
    }
  };

  return (
    <div className="flex space-x-1">
      <FilterMenu onClearFilters={onClear}>
        <FilterMenu.Content>
          {/* <FilterMenu.SelectItem
            name="Status"
            placeholder="Select Status"
            options={statusFilters.map((status) => ({
              value: status,
              label: status,
            }))}
            value={tempState.status.filter}
            onChange={(selectedValues) =>
              setSingleFilter("status", selectedValues)
            }
          /> */}
          {/* <FilterMenu.SelectItem
            name="Collection"
            placeholder="Select Collection"
            options={
              collections?.map((c) => ({ value: c.id, label: c.title })) || []
            }
            value={tempState.collection.filter}
            onChange={(selectedValues) =>
              setSingleFilter("collection", selectedValues)
            }
          /> */}
        {/*                   
        <div className="flex w-full flex-col pb-2">
          <div
            className="hover:bg-grey-5 mb-1 flex w-full cursor-pointer items-center rounded px-3 py-1.5"
            onClick={() => {
              setSingleFilter("tags", {
                open: !tempState.tags.open,
                filter: tempState.tags.filter,
              });
            }}
          >
            <div
              className={`border-grey-30 text-grey-0 rounded-base flex h-5 w-5 justify-center border ${
                tempState.tags.open && "bg-violet-60"
              }`}
            >
              <span className="self-center">
                {tempState.tags.open && <CheckIcon size={16} />}
              </span>
              <input
                type="checkbox"
                className="hidden"
                id="Tags"
                name="Tags"
                value="Tags"
                checked={tempState.tags.open}
              />
            </div>
            <span
              className={clsx("text-grey-90 ml-2", {
                "inter-small-semibold": tempState.tags.open,
                "inter-small-regular": !tempState.tags.open,
              })}
            >
              {t("products-tags", "Tags")}
            </span>
          </div>

          {tempState.tags.open && (
            <div
              data-tip={tempState.tags.invalidTagsMessage || ""}
              className="pl-6"
            >
              <TagInput
                className="pt-0 pb-1"
                showLabel={false}
                placeholder={t("products-spring-summer", "Spring, summer...")}
                values={(tempState.tags.filter || [])
                  .map((t) => {
                    const found = (product_tags || []).find(
                      (pt) => pt.id === t
                    );
                    return found && found.value;
                  })
                  .filter(Boolean)}
                onValidate={(newVal) => {
                  const found = (product_tags || []).find(
                    (pt) => pt.value.toLowerCase() === newVal.toLowerCase()
                  );
                  return found && found.id;
                }}
                onChange={(values) => {
                  setSingleFilter("tags", {
                    open: tempState.tags.open,
                    filter: values,
                  });
                }}
              />
            </div>
          )}
        </div> */}
        </FilterMenu.Content>
      </FilterMenu>
      {tabs &&
          tabs.map((t) => (
            <TabFilter
              key={t.value}
              onClick={() => handleTabClick(t.value)}
              label={t.label}
              isActive={activeTab === t.value}
              removable={!!t.removable}
              onRemove={() => handleRemoveTab(t.value)}
            />
          ))}  
    </div>
  );
};

export default ProductsFilter;
