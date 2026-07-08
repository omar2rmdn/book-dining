type SortOption = Record<string, 1 | -1>;

function getRestaurantSortOption(sort: unknown): SortOption {
  switch (sort) {
    case "rating":
      return { rating: -1 };

    case "price-low":
      return { priceRange: 1 };

    case "price-high":
      return { priceRange: -1 };

    case "reviews":
      return { reviewCount: -1 };

    case "oldest":
      return { createdAt: 1 };

    default:
      return { createdAt: -1 };
  }
}

export { getRestaurantSortOption };
