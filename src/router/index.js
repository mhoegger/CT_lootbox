import Vue from "vue";
import Router from "vue-router";
import Home from "@/components/Home";
import Buy from "@/components/Buy";
import Inventory from "@/components/Inventory";
import MarketPlace from "@/components/MarketPlace";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/buy",
      name: "Buy",
      component: Buy
    },
    {
      path: "/inventory",
      name: "Inventory",
      component: Inventory
    },
    {
      path: "/marketplace",
      name: "MarketPlace",
      component: MarketPlace
    }
  ]
});
