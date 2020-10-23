import { Router } from 'https://deno.land/x/oak/mod.ts';
import { home, signup, kategori} from './Controllers/Blog.ts';

const router = new Router();

router
    .get("/", home)
    .get("/Daftar", signup)
    .post("/Daftar", signup)
    .get("/Kategori/:id", kategori)
    .get("/About", (ctx) =>{
        ctx.response.body = "Ini Halaman About";
    });
export default router;