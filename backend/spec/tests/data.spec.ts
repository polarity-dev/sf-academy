import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test, Response } from 'supertest';

import app from '@server';
import { pErr } from '@shared/functions';
import { MalformedDataFileError, UploadFileMissingError } from '@shared/errors';
import { DataQueue } from '@models/data_queue-model';
import { Data } from '@models/data-model';

const importPath = "/importDataFromFile";
const pendingDataPath = "/pendingData";
const dataPath = "/data";

describe('data-router', () => {
    const { BAD_REQUEST, OK } = StatusCodes;
    let agent: SuperTest<Test>;

    beforeAll((done) => {
        agent = supertest.agent(app);
        done();
    });

    describe(`"POST:${importPath}"`, () => {
        const callApi = (filename: string, fileContent?: string) => {
            const message = Buffer.from(fileContent || '');
            return agent.post(importPath)
                .attach(filename, message, 'file.txt');
        }
        // correct
        const file1 = `2 3\r\n3 10 dummy message\r\n2 -150 test message 1\r\n1 70 test message 2\r\n2 50 dummy message`;
        const file1Lines = 2;
        // wrong first line
        const file2 = `aaa1 2\r\n1 150 gfsdgfds gfsd gf\r\n2 14 dfjhasjfdsa`;

        it(`should return a JSON object with a count of "${file1Lines}" if the request was
            successful.`, (done) => {
            spyOn(DataQueue, 'create').and.returnValue(Promise.resolve(true));
            callApi('file', file1)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body.error).toBeUndefined();
                    expect(res.body.count).toBe(file1Lines);
                    done();
                })
        });

        it(`should return a JSON object with an error message of "${UploadFileMissingError.Msg}" and
            a status code of "${BAD_REQUEST}" if the file is missing.`, (done) => {
            callApi('missingfile', '')
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(BAD_REQUEST);
                    expect(res.body.error).toBe(UploadFileMissingError.Msg);
                    done();
                });
        });

        it(`should return a JSON object with an error message of "${MalformedDataFileError.Msg}" and
            a status code of "${BAD_REQUEST}" if the first line is malformed`, (done) => {
                callApi('file', file2)
                    .end((err: Error, res: Response) => {
                        pErr(err);
                        expect(res.status).toBe(BAD_REQUEST);
                        expect(res.body.error).toBe(MalformedDataFileError.Msg);
                        done();
                    })
            })

    });

    describe(`"GET:${pendingDataPath}"`, () => {

        it(`should return a JSON object with all pending data and a status code
            of "${OK}" if request was successful.`, (done) => {
            const data = [
                new DataQueue({id: 1, priority: 1, message: "test message 1"}),
                new DataQueue({id: 2, priority: 2, message: "test message 2"}),
                new DataQueue({id: 3, priority: 1, message: "test message 3"})
            ];
            spyOn(DataQueue, 'findAll').and.returnValue(Promise.resolve(data));
            
            agent.get(pendingDataPath)
                .end((err: Error, res: Response) => {
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body).toEqual(data.map((d => d.get())));
                    expect(res.body.length).toBe(data.length);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        })

    });

    describe(`"GET:${dataPath}"`, () => {

        it(`should return a JSON object with all processed data and a status code
            of "${OK}" if request was successful.`, (done) => {
            const data = [
                new Data({id: 1, value: -150, message: "test message 1", processed_at: new Date("2022-05-24 10:53")}),
                new Data({id: 2, value: 0, message: "test message 2", processed_at: new Date("2022-05-24 10:53")}),
                new Data({id: 3, value: 73, message: "test message 3", processed_at: new Date("2022-05-25 17:23")}),
                new Data({id: 4, value: 29, message: "test message 4", processed_at: new Date("2022-05-27 10:53")})
            ];
            spyOn(Data, 'findAll').and.returnValue(Promise.resolve(data));
            
            agent.get(dataPath)
                .end((err: Error, res: Response) => {
                    // console.log(res.body);
                    pErr(err);
                    expect(res.status).toBe(OK);
                    expect(res.body).toEqual(
                        data.map(d => Object.assign(
                            d.get(), { processed_at: d.processed_at.toJSON() }
                        ))
                    );
                    expect(res.body.length).toBe(data.length);
                    expect(res.body.error).toBeUndefined();
                    done();
                });
        })

    });


//     /***********************************************************************************
//      *                                    Test Get
//      **********************************************************************************/

//     describe(`"GET:${getUsersPath}"`, () => {

//         it(`should return a JSON object with all the users and a status code of "${OK}" if the
//             request was successful.`, (done) => {
//             // Setup spy
//             const users = [
//                 User.new('Sean Maxwell', 'sean.maxwell@gmail.com'),
//                 User.new('John Smith', 'john.smith@gmail.com'),
//                 User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
//             ];
//             spyOn(userRepo, 'getAll').and.returnValue(Promise.resolve(users));
//             // Call API
//             agent.get(getUsersPath)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(OK);
//                     // Caste instance-objects to 'User' objects
//                     const respUsers = res.body.users;
//                     const retUsers: IUser[] = respUsers.map((user: IUser) => {
//                         return User.copy(user);
//                     });
//                     expect(retUsers).toEqual(users);
//                     expect(res.body.error).toBeUndefined();
//                     done();
//                 });
//         });

//         it(`should return a JSON object containing an error message and a status code of
//             "${BAD_REQUEST}" if the request was unsuccessful.`, (done) => {
//             // Setup spy
//             const errMsg = 'Could not fetch users.';
//             spyOn(userRepo, 'getAll').and.throwError(errMsg);
//             // Call API
//             agent.get(getUsersPath)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     console.log(res.body)
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(errMsg);
//                     done();
//                 });
//         });
//     });


//     /***********************************************************************************
//      *                                    Test Post
//      **********************************************************************************/

//     describe(`"POST:${addUsersPath}"`, () => {

//         const callApi = (reqBody: TReqBody) => {
//             return agent.post(addUsersPath).type('form').send(reqBody);
//         };
//         const userData = {
//             user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
//         };

//         it(`should return a status code of "${CREATED}" if the request was successful.`, (done) => {
//             // Setup Spy
//             spyOn(userRepo, 'add').and.returnValue(Promise.resolve());
//             // Call API
//             agent.post(addUsersPath).type('form').send(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(CREATED);
//                     expect(res.body.error).toBeUndefined();
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a status
//             code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
//             // Call API
//             callApi({})
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(ParamMissingError.Msg);
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//             if the request was unsuccessful.`, (done) => {
//             // Setup spy
//             const errMsg = 'Could not add user.';
//             spyOn(userRepo, 'add').and.throwError(errMsg);
//             // Call API
//             callApi(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(errMsg);
//                     done();
//                 });
//         });
//     });


//     /***********************************************************************************
//      *                                    Test Put
//      **********************************************************************************/

//     describe(`"PUT:${updateUserPath}"`, () => {

//         const callApi = (reqBody: TReqBody) => {
//             return agent.put(updateUserPath).type('form').send(reqBody);
//         };
//         const userData = {
//             user: User.new('Gordan Freeman', 'gordan.freeman@gmail.com'),
//         };

//         it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
//             // Setup spy
//             spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//             spyOn(userRepo, 'update').and.returnValue(Promise.resolve());
//             // Call Api
//             callApi(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(OK);
//                     expect(res.body.error).toBeUndefined();
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message of "${ParamMissingError.Msg}" and a
//             status code of "${BAD_REQUEST}" if the user param was missing.`, (done) => {
//             // Call api
//             callApi({})
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(ParamMissingError.Msg);
//                     done();
//                 });
//         });

//         it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
//             and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
//             // Call api
//             callApi(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(UserNotFoundError.HttpStatus);
//                     expect(res.body.error).toBe(UserNotFoundError.Msg);
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//             if the request was unsuccessful.`, (done) => {
//             spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//             // Setup spy
//             const updateErrMsg = 'Could not update user.';
//             spyOn(userRepo, 'update').and.throwError(updateErrMsg);
//             // Call API
//             callApi(userData)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(updateErrMsg);
//                     done();
//                 });
//         });
//     });


//     /***********************************************************************************
//      *                                    Test Delete
//      **********************************************************************************/

//     describe(`"DELETE:${deleteUserPath}"`, () => {

//         const callApi = (id: number) => {
//             return agent.delete(deleteUserPath.replace(':id', id.toString()));
//         };

//         it(`should return a status code of "${OK}" if the request was successful.`, (done) => {
//             // Setup spy
//             spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//             spyOn(userRepo, 'delete').and.returnValue(Promise.resolve());
//             // Call api
//             callApi(5)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(OK);
//                     expect(res.body.error).toBeUndefined();
//                     done();
//                 });
//         });

//         it(`should return a JSON object with the error message of ${UserNotFoundError.Msg} 
//             and a status code of "${StatusCodes.NOT_FOUND}" if the id was not found.`, (done) => {
//             // Call api
//             callApi(-1)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(StatusCodes.NOT_FOUND);
//                     expect(res.body.error).toBe(UserNotFoundError.Msg);
//                     done();
//                 });
//         });

//         it(`should return a JSON object with an error message and a status code of "${BAD_REQUEST}"
//             if the request was unsuccessful.`, (done) => {
//             spyOn(userRepo, 'persists').and.returnValue(Promise.resolve(true));
//             // Setup spy
//             const deleteErrMsg = 'Could not delete user.';
//             spyOn(userRepo, 'delete').and.throwError(deleteErrMsg);
//             // Call Api
//             callApi(1)
//                 .end((err: Error, res: Response) => {
//                     pErr(err);
//                     expect(res.status).toBe(BAD_REQUEST);
//                     expect(res.body.error).toBe(deleteErrMsg);
//                     done();
//                 });
//         });
//     });
});
