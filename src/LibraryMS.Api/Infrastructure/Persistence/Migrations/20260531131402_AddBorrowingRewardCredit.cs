using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryMS.Api.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddBorrowingRewardCredit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RewardCredit",
                table: "BorrowingRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RewardCredit",
                table: "BorrowingRecords");
        }
    }
}
