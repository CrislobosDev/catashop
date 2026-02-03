import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/admin", "/carrito"],
        },
        sitemap: "https://catashop.cl/sitemap.xml",
    };
}
