import { EmailValidator } from './../protocols/email-validator';
import { InvalidParamError } from './errors/invalid-param-error';
import { MissingParamError } from './errors/missing-param-error';
import { SignUpController } from './Signup';

interface SutTypes {
    sut: SignUpController
    emailValidatorStub: EmailValidator
}

const makeSut = (): SutTypes=> {
    class EmailValidatorStub implements EmailValidator{
        isValid(email: string): boolean{
            return true
        }
    }
    const emailValidatorStub = new EmailValidatorStub()

    const sut = new SignUpController(emailValidatorStub)

    return {
        sut, emailValidatorStub
    }
}

describe('SignUp Controller', ()=>{
    test('Should return 400 if no name is proveded', ()=>{

        const {sut} = makeSut()
        const httpRequest = {
            body: {
                // name: 'any_name',
                email: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('name'))
    })

    test('Should return 400 if no email is proveded', ()=>{

        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                // email: 'any_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('email'))
    })

    test('Should return 400 if no password is proveded', ()=>{

        const {sut} = makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                // password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('password'))
    })
    
    test('Should return 400 if no confirm password is proveded', ()=>{

        const {sut} =makeSut()
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'any_email',
                password: 'any_password',
                // passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
    })

    test('Should return 400 if an invalid email is provided', ()=>{

        const {sut, emailValidatorStub} =makeSut()
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
        const httpRequest = {
            body: {
                name: 'any_name',
                email: 'invalid_email',
                password: 'any_password',
                passwordConfirmation: 'any_password'
            }
        }
        const httpResponse = sut.handle(httpRequest)
    
        expect(httpResponse.statusCode).toBe(400)
        expect(httpResponse.body).toEqual(new InvalidParamError('email'))
    })
})