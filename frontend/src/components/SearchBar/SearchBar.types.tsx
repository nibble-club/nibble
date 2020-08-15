export type SearchBarProps = {
  searchFocused: boolean;
  searchString: string;
  setSearchString: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
};
