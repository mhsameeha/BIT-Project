﻿namespace BusinessService.Models.DTOs
{
    public class GetUserProfileDto
    {
        public Guid Id { get; set; }

        public string? FirstName { get; set; }
        public string? LastName { get; set; }

        public string Email { get; set; }

    }
}
