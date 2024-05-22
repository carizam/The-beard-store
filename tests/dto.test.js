class UserDTO {
    constructor(user) {
      this.fullName = `${user.first_name} ${user.last_name}`;
      this.email = user.email;
    }
  
    toJSON() {
      return {
        fullName: this.fullName,
        email: this.email,
      };
    }
  }
  
  describe('User DTO', () => {
    const user = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    };
  
    let userDTO;
  
    beforeAll(() => {
      userDTO = new UserDTO(user);
    });
  
    test('sE Ddebe unificar el nombre y el apellido en el nombre completo', () => {
      expect(userDTO.fullName).toBe('John Doe');
    });
  
    test('debe eliminar propiedades innecesarias', () => {
      const json = userDTO.toJSON();
      expect(json).not.toHaveProperty('password');
      expect(json).not.toHaveProperty('first_name');
      expect(json).not.toHaveProperty('last_name');
    });
  });