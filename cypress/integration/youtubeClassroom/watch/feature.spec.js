describe("youtube classroom 기능 테스트", () => {
  before(() => {
    cy.visit("http://127.0.0.1:5500/");
  });

  it("저장버튼을 누르면 볼 영상에 추가된다.", () => {
    cy.get("#search-button").click();
    cy.get("#search-form > input").type("javascript");
    cy.get("#search-form > button").click();

    cy.get("#search-results button[data-video-id]")
      .eq(0)
      .click()
      .then(([$clickedButton]) => {
        return $clickedButton.dataset.videoId;
      })
      .then((savedVideoId) => {
        cy.get("#search-modal-close").click();
        cy.get("#watch-later-videos").children().should("have.length", 1);
        cy.get("#watch-later-videos > article button")
          .eq(0)
          .then(([$watchedViewButton]) => {
            expect($watchedViewButton.dataset.watchedButton).to.eq(
              savedVideoId
            );
          });
      });
  });

  it("like 버튼을 누르면, 좋아요 영상 목록에 추가된다.", () => {
    cy.get("#watch-later-videos button[data-liked-button]")
      .eq(0)
      .click()
      .then(() => {
        cy.get("#watch-later-videos button[data-liked-button]")
          .eq(0)
          .should("not.have.class", "opacity-hover");
      })
      .then(([$clickedButton]) => {
        return $clickedButton.dataset.likedButton;
      })
      .then((likedVideoId) => {
        cy.get("#liked-view-button").click();
        cy.get("#watch-later-videos").should("not.be.visible");
        cy.get("#watched-videos").should("not.be.visible");

        cy.get("#liked-videos button[data-liked-button]")
          .eq(0)
          .then(([$clickedButton]) => {
            $clickedButton.dataset.likedButton === likedVideoId;
          });
      });
  });

  it("like 버튼을 다시 누르면, 좋아요 영상 목록에서 삭제된다.", () => {
    cy.get("#liked-videos button[data-liked-button]")
      .eq(0)
      .click()
      .then(() => {
        cy.get("#not-liked").should("be.visible");
      })
      .then(([$clickedButton]) => {
        return $clickedButton.dataset.likedButton;
      })
      .then((likedVideoId) => {
        cy.get("#watch-later-view-button").click();
        cy.get("#liked-videos").should("not.be.visible");
        cy.get("#watched-videos").should("not.be.visible");

        cy.get("#watch-later-videos button[data-liked-button]")
          .eq(0)
          .then(([$clickedButton]) => {
            $clickedButton.dataset.likedButton === likedVideoId;
          });

        cy.get("#watch-later-videos button[data-liked-button]")
          .eq(0)
          .should("have.class", "opacity-hover");
      });
  });

  it("watch 버튼을 누르면, 본 영상에 추가된다.", () => {
    cy.get("#watch-later-view-button").click();
    cy.get("#watch-later-videos button[data-watched-button]")
      .eq(0)
      .click()
      .then(([$clickedButton]) => {
        return $clickedButton.dataset.watchedButton;
      })
      .then((watchedVideoId) => {
        cy.get("#watch-later-videos").should("not.be.visible");
        cy.get("#not-saved").should("be.visible");

        cy.get("#watched-view-button").click();
        cy.get("#watched-videos").children().should("have.length", 1);
        cy.get("#watched-videos > article button")
          .eq(0)
          .then(([$watchedButton]) => {
            expect($watchedButton.dataset.watchedButton).to.eq(watchedVideoId);
          });

        cy.get("#watched-videos button[data-watched-button]")
          .eq(0)
          .should("not.have.class", "opacity-hover");
      });
  });

  it("watch 버튼을 다시 누르면, 볼 영상에 추가된다.", () => {
    cy.get("#watched-videos button[data-watched-button]")
      .eq(0)
      .click()
      .then(([$clickedButton]) => {
        return $clickedButton.dataset.watchedButton;
      })
      .then((watchedVideoId) => {
        cy.get("#watched-videos").should("not.be.visible");
        cy.get("#not-watched").should("be.visible");

        cy.get("#watch-later-view-button").click();
        cy.get("#watch-later-videos").children().should("have.length", 1);
        cy.get("#watch-later-videos > article button")
          .eq(0)
          .then(([$watchedButton]) => {
            expect($watchedButton.dataset.watchedButton).to.eq(watchedVideoId);
          });

        cy.get("#watch-later-videos button[data-watched-button]")
          .eq(0)
          .should("have.class", "opacity-hover");
      });
  });

  it("delete 버튼을 누르면, 볼 영상에서 삭제된다.", () => {
    const confirmStub = cy.stub();

    cy.on("window:confirm", (message) => {
      confirmStub(message);
      return true;
    });

    cy.get("#watch-later-videos button[data-delete-button]")
      .eq(0)
      .click()
      .then(() => {
        expect(confirmStub.getCall(0)).to.be.calledWith(
          "정말로 삭제하시겠습니까?"
        );
      });

    cy.get("#not-saved").should("be.visible");
    cy.get("#watched-view-button").click();
    cy.get("#not-watched").should("be.visible");
  });

  it("delete 버튼을 누르면, 본 영상에서 삭제된다.", () => {
    const confirmStub = cy.stub();

    cy.on("window:confirm", (message) => {
      confirmStub(message);
      return true;
    });

    cy.get("#search-button").click();
    cy.get("#search-results button[data-video-id]").eq(0).click();
    cy.get("#search-modal-close").click();

    cy.get("#watch-later-videos button[data-watched-button]").eq(0).click();
    cy.get("#not-saved").should("be.visible");

    cy.get("#watched-view-button").click();
    cy.get("#watched-videos button[data-delete-button]")
      .eq(0)
      .click()
      .then(() => {
        expect(confirmStub.getCall(0)).to.be.calledWith(
          "정말로 삭제하시겠습니까?"
        );
      });
    cy.get("#not-watched").should("be.visible");
  });
});
