import React from "react";

import { withKnobs } from "@storybook/addon-knobs";

import HeroImage from "./HeroImage";

export default {
  component: HeroImage,
  title: "HeroImage",
  excludeStories: /.*Props$/,
  decorators: [withKnobs],
  parameters: {
    knobs: {
      escapeHTML: false,
    },
  },
};

export const Loading = () => <HeroImage loading={true} />;

export const Image = () => (
  <div>
    <HeroImage
      location={{
        bucket: "800344761765-dev-adchurch-restaurant-heros",
        key: "fbf4bf1a-6c90-4c96-ae50-715d7edcd2a8.jpg",
        region: "us-west-2",
      }}
    />
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean gravida id lacus
      eu feugiat. Suspendisse ultrices lectus nisi, volutpat malesuada urna porttitor
      non. Nulla et blandit purus, ac sodales sapien. Mauris id lacus in ipsum finibus
      blandit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc posuere leo
      quis neque dapibus, eu sollicitudin nisl mollis. Etiam consequat tellus ac dui
      laoreet imperdiet. Sed ac nulla venenatis, vehicula dui a, lacinia nisl. Proin
      cursus arcu ac eros venenatis cursus. Suspendisse nec dolor id dolor sollicitudin
      fringilla a ut nisl. Mauris nisi tellus, sagittis nec sapien a, molestie laoreet
      justo. Nunc luctus, mi eget consectetur laoreet, augue sapien placerat lorem, a
      molestie tellus mi at urna. Maecenas posuere finibus consectetur. Pellentesque
      lorem orci, semper et sollicitudin quis, mollis vitae tellus. Curabitur dolor
      mauris, pharetra et elit non, pretium varius magna. Aliquam lobortis leo non
      tristique pretium. Etiam molestie vulputate lectus vitae pellentesque. Donec non
      metus at lorem aliquam tempus. Duis faucibus volutpat accumsan. Fusce bibendum sit
      amet lectus id auctor. Aenean faucibus, nisi sit amet ultricies volutpat, tellus
      nunc semper sem, et auctor lectus diam in elit. Fusce luctus, arcu vel mollis
      pretium, augue tortor vestibulum turpis, ac maximus nulla orci quis arcu. Praesent
      commodo, sem nec tristique tempor, diam neque luctus erat, nec sodales risus
      lectus a ligula. Mauris magna mauris, scelerisque non consequat at, posuere id
      leo. Integer quis hendrerit mi. Ut neque odio, molestie non semper in, rutrum nec
      nunc. Integer porta mattis ligula, sed egestas risus suscipit vitae. Aliquam
      pharetra purus non finibus sollicitudin. Donec lacinia, mi ut rutrum aliquam, arcu
      dui sagittis mi, eget aliquet orci diam et massa. Morbi in ligula vel nulla
      fermentum rutrum. Aliquam consectetur ipsum mattis, condimentum arcu at, dignissim
      dui. Maecenas dapibus maximus leo et maximus. Sed facilisis, augue at maximus
      interdum, leo ligula tincidunt neque, vel efficitur libero nulla rhoncus odio.
      Suspendisse mi ex, fringilla et dictum et, tincidunt a nisi. Integer ac dui ac
      dolor pellentesque tincidunt id id ipsum. Fusce varius lacus vel risus sodales,
      sit amet eleifend augue pretium. Vestibulum sed elit laoreet, blandit tortor
      vitae, ullamcorper quam. Ut viverra arcu sed sollicitudin molestie. In hac
      habitasse platea dictumst. Mauris vehicula odio ut nunc tincidunt fermentum in
      vitae risus. Praesent dapibus sapien id odio pulvinar eleifend. Morbi elit ante,
      facilisis in iaculis nec, ultrices eu elit. Integer at dolor sit amet arcu feugiat
      lobortis. Nulla eget leo libero. Integer volutpat, enim et lacinia laoreet, ligula
      lacus ornare lorem, quis condimentum nunc neque in mauris. Integer ex enim, porta
      id massa nec, luctus ullamcorper ligula. Nulla sed iaculis nunc. Quisque efficitur
      eget ante et vehicula. Fusce dolor nulla, maximus et nisi nec, auctor facilisis
      augue. Donec finibus, dui luctus lacinia malesuada, mi magna pretium nibh, vitae
      bibendum elit sem at felis. Suspendisse ultricies quis ipsum ac auctor. Nulla
      condimentum vitae risus eget commodo. Pellentesque blandit dui eget lectus mattis,
      sed luctus mi fermentum. In sodales, magna nec porttitor rutrum, ligula magna
      commodo augue, eget posuere velit eros eget urna. Vivamus sit amet lorem euismod,
      aliquam neque id, sodales lacus. Vestibulum nec sodales ante. Aenean felis risus,
      fringilla in arcu in, bibendum commodo risus. Proin arcu sapien, blandit vel
      mollis sit amet, laoreet sed dolor. Integer vehicula facilisis sem ut imperdiet.
      Pellentesque finibus tristique ligula id aliquam. Ut id nisi vel turpis interdum
      accumsan quis in justo. Morbi porttitor ante ac quam auctor, quis gravida erat
      pulvinar.
    </p>
  </div>
);
