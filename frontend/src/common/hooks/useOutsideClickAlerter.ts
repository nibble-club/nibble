import { useEffect } from "react";

/**
 * Hook that hides search on clicks outside of the passed ref; credit to
 * https://stackoverflow.com/a/42234988/4932372
 */
const useOutsideClickAlerter = (
  refs: React.MutableRefObject<HTMLDivElement | null>[],
  callback: () => void
) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))
      ) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [refs, callback]);
};

export default useOutsideClickAlerter;
