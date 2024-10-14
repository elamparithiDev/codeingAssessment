
import app from "../app"
import axios from "axios"
import * as request from 'supertest';
import * as sinon from 'sinon'

// group test using describe
const sandbox = sinon.createSandbox();
describe("GET /getPageOfMovies API Call", () => {
    afterEach(function () {
        sandbox.restore();
    });
    it("returns valid data once the data received from API call", async () => {
        sandbox
            .stub(axios, 'get')
            .withArgs('https://api.themoviedb.org/3/discover/movie?language=en-US&page=4&primary_release_year=2016&sort_by=popularity.desc')
            .resolves(
                {
                    data:
                    {
                        results: [
                            {
                                "title": "The Girl on the Train",
                                "release_date": "2016-10-05",
                                "vote_average": 6.4
                            },
                            {
                                "title": "Hacker",
                                "release_date": "2016-09-15",
                                "vote_average": 6.275
                            }
                        ]
                    }
                });
        const res = await request(app)
            .get("/getPageOfMovies?pageNumber=4&releaseYear=2016")
            .send();
        let resText = JSON.parse(res.text)
        expect(resText.length).toEqual(2)
        expect(resText[0].title).toEqual('The Girl on the Train')
        expect(resText[0].release_date).toEqual('2016-10-05')
        expect(resText[1].vote_average).toEqual(6.275)
    });

    it("returns status code 400 if page number and year not passed as query parameter", async () => {
        const res = await request(app)
            .get("/getPageOfMovies")
            .send();
        let resText = JSON.parse(res.text)
        expect(resText.statusCode).toEqual(400)
        expect(resText.message).toEqual('Page Number and Year is required !!!')
    });

    it("Should not fail if movie throws error", async () => {
        const sandbox = sinon.createSandbox();
        let error = 'Api call failed'
        sandbox
            .stub(axios, 'get')
            .withArgs('https://api.themoviedb.org/3/discover/movie?language=en-US&page=4&primary_release_year=2016&sort_by=popularity.desc')
            .throws(error)
        const res = await request(app)
            .get("/getPageOfMovies?pageNumber=4&releaseYear=2016")
            .send();
        let resText = JSON.parse(res.text)
        expect(resText.type).toEqual('Error')
        expect(resText.err.name).toEqual('Api call failed')
    });
});
