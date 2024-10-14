vimport * as express from 'express';
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
const router = express.Router()
import axios from 'axios'
import { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios'
dotenv.config();
const token = process.env.TOKEN
/**
 * Route to get the Movie detail for page number and year
 */
router.get('/getPageOfMovies', async (req: Request, res: Response) => {
    try {
        const pageNumber = req.query.pageNumber
        const releaseYear = req.query.releaseYear
        if (!pageNumber && !releaseYear) {
            res.send({ statusCode: 400, message: "Page Number and Year is required !!!" })
        } else {
            const config: AxiosRequestConfig = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': token
                } as RawAxiosRequestHeaders,
            }
            const queryString: string = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=${pageNumber}&primary_release_year=${releaseYear}&sort_by=popularity.desc`;
            let apiData = await axios.get(queryString, config)
            let newData: any = apiData.data.results
            if (newData && newData.length) {
                newData = newData.map(data => {
                    let dataObj = {
                        title: data.title,
                        release_date: data.release_date,
                        vote_average: data.vote_average
                    }
                    if (data?.editors) {
                        dataObj['editors'] = data.editors
                    }
                    return dataObj
                })
                res.send(newData);
            } else {
                res.send({ statusCode: 404, message: 'No records found for the page number and year' })
            }
        }
    } catch (err: any) {
        res.send({type:'Error',err})
    }
});
export default router
