using BusinessService.Data;
using BusinessService.Interfaces;
using BusinessService.Models.DTOs;
using BusinessService.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mybackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EnrollmentController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
       public EnrollmentController(ApplicationDbContext context)
        {
            _context = context;
        }
        // GET: api/<EnrollmentController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<EnrollmentController>/5
        [HttpGet("{id}")]
        public List<EnrollmentDto> Get(Guid id)
        {
            IEnrollementService EnrollementService = new EnrollementService(_context);
            var result = EnrollementService.GetEnrolledCourses(id);
            return result;
        }

        // POST api/<EnrollmentController>/payment
        [HttpPost("payment")]
        public async Task<ActionResult<PaymentResponseDto>> ProcessPayment([FromForm] PaymentRequestDto request)
        {
            try
            {
                // Convert file to byte array if provided
                var email = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    return Unauthorized(new { message = "User is not authenticated." });
                }
                byte[]? paymentProof = null;
                if (request.PaymentProof != null && request.PaymentProof.Length > 0)
                {
                    using var memoryStream = new MemoryStream();
                    await request.PaymentProof.CopyToAsync(memoryStream);
                    paymentProof = memoryStream.ToArray();
                }

                var paymentDto = new PaymentDto
                {
                    CourseId = request.CourseId,
                    Amount = request.Amount,
                    Currency = request.Currency ?? "LKR",
                    TransactionReference = request.TransactionReference,
                    PaymentProof = paymentProof,
                    PaymentType = "BankTransfer"
                };

                IEnrollementService enrollmentService = new EnrollementService(_context);
                var result = await enrollmentService.ProcessPaymentAsync(paymentDto, email);
                
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing payment.", details = ex.Message });
            }
        }

        // POST api/<EnrollmentController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<EnrollmentController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<EnrollmentController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
